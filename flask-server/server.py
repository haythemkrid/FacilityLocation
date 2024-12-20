from flask import Flask, request, jsonify
from gurobipy import Model, GRB, quicksum
import matplotlib.pyplot as plt
import networkx as nx
from input import *
from solve import *
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/app3/capacitated", methods=["POST"]) # app32
def capacitated():
    try:
        # Get inputs from request JSON
        data = request.json
        num_facilities = data.get("num_facilities")
        num_customers = data.get("num_customers")
        fixed_costs = data.get("fixed_costs")
        transportation_costs = data.get("transportation_costs")
        capacities = data.get("capacities")
        demands = data.get("demands")

        # Validate inputs
        if not all([num_facilities, num_customers, fixed_costs, transportation_costs, capacities, demands]):
            return jsonify({"error": "Missing required inputs"}), 400

        # Solve the problem
        CustomerAssignments, CapacitiesUsed = solve_flp_capacitated(num_facilities, num_customers, fixed_costs, transportation_costs, capacities, demands)
        print(capacities)
        # Convert solutions to string format for JSON response


        return jsonify({"solutions": [CustomerAssignments, CapacitiesUsed    ]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/app3/uncapacitated", methods=["POST"]) #app31
def uncapacitated():
    try:
        # Get inputs from request JSON
        data = request.json
        num_facilities = data.get("num_facilities")
        num_customers = data.get("num_customers")
        fixed_costs = data.get("fixed_costs")
        transportation_costs = data.get("transportation_costs")

        # Validate inputs
        if not all([num_facilities, num_customers, fixed_costs, transportation_costs]):
            return jsonify({"error": "Missing required inputs"}), 400

        # Solve the problem
        CustomerAssignments, FacilitiesOpened = solve_flp_uncapacitated(num_facilities, num_customers, fixed_costs, transportation_costs)


        return jsonify({"solutions": [CustomerAssignments, FacilitiesOpened]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/app1", methods=['POST']) #app1
def set_covering_problem_with_distances():
    try:
        # Get inputs from request JSON
        data = request.json
        num_installations = data.get("num_installations")
        num_demands = data.get("num_demands")
        distances = data.get("distances")
        service_levels = data.get("service_levels")


        # Validate inputs
        if not all([num_installations, num_demands, distances, service_levels]):
            return jsonify({"error": "Missing required inputs"}), 400

        # Solve the problem
        selected_installations = solve_set_covering_problem_with_distances(num_installations, num_demands, distances, service_levels)

        return jsonify({"solution": selected_installations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/app2", methods=["POST"]) #app2
def max_covering_with_distance():
    try:
        # Get inputs from request JSON
        data = request.json
        num_installations = data.get("num_installations") # integer
        num_demands = data.get("num_demands") # integer
        distances = data.get("distances") # matrix ( num_demands * num_installations)
        service_levels = data.get("service_levels") # integer
        num_to_open = data.get("num_to_open") # integer

        # Validate inputs
        if not all([num_installations, num_demands, distances, service_levels, num_to_open]):
            return jsonify({"error": "Missing required inputs"}), 400

        # Solve the problem
        selected_installations = solve_max_covering_with_distance(num_installations, num_demands, distances, num_to_open, service_levels)

        return jsonify({"solution": selected_installations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
