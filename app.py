import os
from flask_sqlalchemy import SQLAlchemy
from model import *

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)


app = Flask(__name__)

DB_URL = 'postgresql://eynjeleywopzpd:faa6c1ed8f60c969b72d838fe60e02cc5e2bb3bfc614b01e5449db9f6c3b1dee@ec2-34-235-108-68.compute-1.amazonaws.com:5432/dcuv8ruasf6mj0'

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning

db = SQLAlchemy(app)



@app.route("/api/get_parking_spots")
def get_parking_spots():
    results = db.session.query(ParkingSpot.garage_id, ParkingSpot.rate_per_half_hour, ParkingSpot.lat, ParkingSpot.lng).all()


    garage_id = [result[0] for result in results]
    rate_per_half_hour = [result[1] for result in results]
    lat = [result[2] for result in results]
    lng = [result[3] for result in results]

    parking_data = [{
       "garage_id": garage_id,
        "rate_per_half_hour": rate_per_half_hour,
        "lat": lat,
        "lng": lng
    }]

    return jsonify(parking_data)

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run()