# Function to get input from the user
def get_user_input_capacitated():
    print("Generalized Facility Location Problem Solver")

    # Number of facilities and customers
    num_facilities = int(input("Enter the number of facilities: "))
    num_customers = int(input("Enter the number of customers: "))

    # Fixed costs for facilities
    fixed_costs = []
    print("Enter the fixed costs for each facility:")
    for i in range(num_facilities):
        cost = float(input(f"  Fixed cost for facility {i + 1}: "))
        fixed_costs.append(cost)

    # Transportation costs
    transportation_costs = []
    print("Enter the transportation costs (rows: facilities, columns: customers):")
    for i in range(num_facilities):
        row = list(map(float, input(f"  Costs for facility {i + 1} (space-separated): ").split()))
        transportation_costs.append(row)

    # Facility capacities
    capacities = []
    print("Enter the capacity for each facility (compulsory):")
    for i in range(num_facilities):
        cap = float(input(f"  Capacity for facility {i + 1}: "))
        capacities.append(cap)

    # Customer demands
    demands = []
    print("Enter the demand for each customer:")
    for j in range(num_customers):
        demand = float(input(f"  Demand for customer {j + 1}: "))
        demands.append(demand)

    # Option to display graph
    display_graph = input("Do you want to display the graph? (yes/no): ").lower() == 'yes'

    return num_facilities, num_customers, fixed_costs, transportation_costs, capacities, demands, display_graph


# Function to get input from the user
def get_user_input_uncapacitated():
    print("Uncapacitated Facility Location Problem Solver")

    # Number of facilities and customers
    num_facilities = int(input("Enter the number of facilities: "))
    num_customers = int(input("Enter the number of customers: "))

    # Fixed costs for facilities
    fixed_costs = []
    print("Enter the fixed costs for each facility:")
    for i in range(num_facilities):
        cost = float(input(f"  Fixed cost for facility {i + 1}: "))
        fixed_costs.append(cost)

    # Transportation costs
    transportation_costs = []
    print("Enter the transportation costs (rows: facilities, columns: customers):")
    for i in range(num_facilities):
        row = list(map(float, input(f"  Costs for facility {i + 1} (space-separated): ").split()))
        transportation_costs.append(row)

    return num_facilities, num_customers, fixed_costs, transportation_costs