from gurobipy import Model, GRB, quicksum
import matplotlib.pyplot as plt

# Generalized FLP solver with fixed capacities
def solve_flp_capacitated(num_facilities, num_customers, fixed_costs, transportation_costs, capacities, demands):
    # Create the model
    model = Model("Generalized_Facility_Location")

    # Decision variables
    y = model.addVars(num_facilities, vtype=GRB.BINARY, name="Open")  # Facility open/close variables
    x = model.addVars(num_facilities, num_customers, vtype=GRB.BINARY, name="Assign")  # Assignment variables

    # Objective function: Minimize fixed costs + transportation costs
    model.setObjective(
        quicksum(fixed_costs[i] * y[i] for i in range(num_facilities)) +
        quicksum(transportation_costs[i][j] * x[i, j] for i in range(num_facilities) for j in range(num_customers)),
        GRB.MINIMIZE
    )

    # Constraints
    # Each customer must be assigned to exactly one facility
    for j in range(num_customers):
        model.addConstr(quicksum(x[i, j] for i in range(num_facilities)) == 1, name=f"Customer_Assign_{j}")

    # A facility must be open if it serves any customers
    for i in range(num_facilities):
        for j in range(num_customers):
            model.addConstr(x[i, j] <= y[i], name=f"Facility_Open_{i}_Customer_{j}")

    # Capacity constraints: Total demand served by a facility must not exceed its capacity
    for i in range(num_facilities):
        model.addConstr(
            quicksum(demands[j] * x[i, j] for j in range(num_customers)) <= capacities[i],
            name=f"Capacity_{i}"
        )

    # Solve the model
    model.optimize()

    # Display results
    if model.status == GRB.OPTIMAL:
        print("\nOptimal Solution:")
        print("Facilities Opened:")
        for i in range(num_facilities):
            if y[i].x > 0.5:
                print(f"  Facility {i + 1} is open.")

        CustomerAssignments = []
        print("\nCustomer Assignments:")
        for i in range(num_facilities):
            for j in range(num_customers):
                if x[i, j].x > 0.5:
                    ch=f"  Customer {j + 1} is served by Facility {i + 1}."
                    CustomerAssignments.append(ch)
                    print(ch)

        capacities_used = []
        print("\nFacility Capacities Used:")
        for i in range(num_facilities):
            capacity_used = sum(demands[j] * x[i, j].x for j in range(num_customers))
            if y[i].x > 0.5:
                ch=f"  Facility {i + 1}: {int(capacity_used)}/{capacities[i]}"
                capacities_used.append(ch)
                print(ch)
    else:
        print("No optimal solution found.")

    return CustomerAssignments, capacities_used


# Generalized FLP solver with fixed capacities
def solve_flp_uncapacitated(num_facilities, num_customers, fixed_costs, transportation_costs):
    # Create the optimization model
    model = Model("Uncapacitated_Facility_Location")

    # Decision variables
    x = model.addVars(num_facilities, vtype=GRB.BINARY, name="Open")  # Facility open/close variables
    y = model.addVars(num_facilities, num_customers, vtype=GRB.BINARY, name="Assign")  # Assignment variables

    # Objective function: Minimize fixed costs + transportation costs
    model.setObjective(
        quicksum(fixed_costs[i] * x[i] for i in range(num_facilities)) +
        quicksum(transportation_costs[i][j] * y[i, j] for i in range(num_facilities) for j in range(num_customers)),
        GRB.MINIMIZE
    )

    # Constraints
    # Each customer must be assigned to exactly one facility
    for j in range(num_customers):
        model.addConstr(quicksum(y[i, j] for i in range(num_facilities)) == 1, name=f"Customer_Assign_{j}")

    # A facility must be open if it serves any customers
    for i in range(num_facilities):
        for j in range(num_customers):
            model.addConstr(y[i, j] <= x[i], name=f"Facility_Open_{i}_Customer_{j}")

    # Solve the model
    model.optimize()

    # Display results
    facility_colors = {}  # To store facility colors for graph visualization
    if model.status == GRB.OPTIMAL:
        print("\nOptimal Solution:")

        FacilitiesOpened=[]
        print("Facilities Opened:")
        for i in range(num_facilities):
            if x[i].x > 0.5:
                ch=f"  Facility {i + 1} is open."
                FacilitiesOpened.append(ch)
                print(ch)
                # facility_colors[i] = (random.random(), random.random(), random.random())  # Assign a random color

        print("\nCustomer Assignments:")
        CustomerAssignments=[]
        customer_assignments = {}  # To store customer-facility assignments for visualization
        for i in range(num_facilities):
            for j in range(num_customers):
                if y[i, j].x > 0.5:
                    ch=f"  Customer {j + 1} is served by Facility {i + 1}."
                    CustomerAssignments.append(ch)
                    print(ch)
                    customer_assignments[j] = i

        # Visualize the graph if the user chooses to
        """if visualize_graph:
            draw_facility_location_graph(
                num_facilities, num_customers, transportation_costs, facility_colors, customer_assignments
            )"""
        return CustomerAssignments, FacilitiesOpened
    else:
        print("No optimal solution found.")
        return 0, 0, 0


def solve_set_covering_problem_with_distances(num_installations, num_demands, distances, service_levels):
    """
    Résout le Set Covering Problem avec des distances et niveaux de service.

    Arguments :
    - num_installations : nombre d'installations disponibles.
    - num_demands : nombre de demandes à couvrir.
    - distances : matrice des distances (num_demands x num_installations).
    - service_levels : liste des niveaux de service pour chaque demande (taille num_demands).

    Retour :
    - Les indices des installations sélectionnées pour couvrir toutes les demandes.
    """

    # Créer un modèle
    model = Model("SetCovering_with_distances")

    # Variables de décision
    x = model.addVars(num_installations, vtype=GRB.BINARY, name="x")  # 1 si l'installation j est ouverte
    y = model.addVars(num_demands, num_installations, vtype=GRB.BINARY,
                      name="y")  # 1 si l'installation j couvre la demande i

    # Objectif : Minimiser le nombre d'installations ouvertes
    model.setObjective(quicksum(x[j] for j in range(num_installations)),
                       sense=GRB.MINIMIZE)

    # Contraintes :

    # 1. Chaque demande doit être couverte par au moins une installation
    for i in range(num_demands):
        model.addConstr(quicksum(y[i, j] for j in range(num_installations)) >= 1, f"CoverDemand_{i}")

    # 2. Une installation j ne peut couvrir la demande i que si elle est ouverte
    for i in range(num_demands):
        for j in range(num_installations):
            model.addConstr(y[i, j] <= x[j], f"Link_y_x_{i}_{j}")

    # 3. Couverture basée sur la distance et le niveau de service
    for i in range(num_demands):
        for j in range(num_installations):
            if distances[i][j] > service_levels[i]:
                model.addConstr(y[i, j] == 0, f"DistanceLimit_{i}_{j}")

    # Résoudre le modèle
    model.optimize()

    # Extraire les résultats
    if model.status == GRB.OPTIMAL:
        selected_installations = [j+1 for j in range(num_installations) if x[j].x > 0.5]
        print(distances)
        print(selected_installations)
        return selected_installations
    else:
        return None


def solve_max_covering_with_distance(num_installations, num_demands, distances, num_to_open, service_level):
    """
    Résout le Max Covering Problem avec distances et niveau de service en utilisant Gurobi.

    Arguments :
    - num_installations : nombre d'installations disponibles.
    - num_demands : nombre de demandes à couvrir.
    - distances : matrice de distances (num_demands x num_installations) où distances[i][j] est la distance entre la demande i et l'installation j.
    - num_to_open : nombre d'installations à ouvrir.
    - service_level : distance maximale acceptée pour qu'une installation couvre une demande.

    Retour :
    - Les indices des installations à ouvrir pour maximiser la couverture.
    """

    # Créer un modèle
    model = Model("MaxCoveringWithDistance")

    # Variables de décision
    x = model.addVars(num_installations, vtype=GRB.BINARY, name="x")  # 1 si l'installation j est ouverte
    y = model.addVars(num_demands, num_installations, vtype=GRB.BINARY,
                      name="y")  # 1 si l'installation j couvre la demande i

    # Objectif : Maximiser la couverture des demandes
    model.setObjective(quicksum(y[i, j] for i in range(num_demands) for j in range(num_installations)),
                       sense=GRB.MAXIMIZE)

    # Contraintes :

    # 1. Chaque demande doit être couverte par au moins une installation
    for i in range(num_demands):
        model.addConstr(quicksum(y[i, j] for j in range(num_installations)) >= 1, f"CoverDemand_{i}")

    # 2. Limiter le nombre d'installations ouvertes à `num_to_open`
    model.addConstr(quicksum(x[j] for j in range(num_installations)) == num_to_open, "LimitInstallations")

    # 3. L'installation j ne peut couvrir la demande i que si elle est ouverte et si la distance est inférieure ou égale à `service_level`
    for i in range(num_demands):
        for j in range(num_installations):
            if distances[i][j] > service_level[i]:  # Si la distance est trop grande, la couverture n'est pas possible
                model.addConstr(y[i, j] == 0, f"DistanceLimit_{i}_{j}")
            model.addConstr(y[i, j] <= x[j], f"Link_y_x_{i}_{j}")

    # Résoudre le modèle
    model.optimize()

    # Extraire les résultats
    if model.status == GRB.OPTIMAL:
        selected_installations = [j+1 for j in range(num_installations) if x[j].x > 0.5]
        print(x)
        return selected_installations
    else:
        return None
