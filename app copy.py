from flask import Flask, jsonify
import psycopg2
import os
from dotenv import load_dotenv
from flask import render_template
import numpy as np


load_dotenv()
print("DB_USER:", os.getenv("DB_USER"))
print("DB_PASSWORD:", os.getenv("DB_PASSWORD"))
app = Flask(__name__)

def connect_to_db():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )

@app.route('/')
def index():
    return render_template('index.html')
### year return data
@app.route('/api/daily_crime_rate/<int:year>', methods=['GET'])
def daily_crime_rate(year):
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM crime_data WHERE report_year = {year}")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)

### avaliable years:
@app.route('/api/available_years', methods=['GET'])
def available_years():
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT report_year FROM crime_data ORDER BY report_year")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify([row[0] for row in results])

#### crime by month report:
@app.route('/api/monthly_crime_rate/<int:year>', methods=['GET'])
def monthly_crime_rate(year):
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute(f"SELECT mci_category, report_month FROM crime_data WHERE report_year = {year} Order BY mci_category, report_month")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify([{'mci_category':row[0], 'month':row[1]}for row in results])

#### crime by date report 
@app.route('/api/crime_data_by_type/<string:crime_type>', methods=['GET'])
def crime_data_by_type(crime_type):
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute(f"SELECT report_dow, COUNT(*) as count FROM crime_data WHERE premises_type = '{crime_type}' GROUP BY report_dow")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify([{'report_day': row[0], 'count': row[1]} for row in results])

#### neighbourhood
@app.route('/api/neighborhoods', methods=['GET'])
def neighborhoods():
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT neighbourhood_158 FROM crime_data")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify([row[0] for row in results])

@app.route('/api/crime_data_by_neighborhood/<string:neighborhood>', methods=['GET'])
def crime_data_by_neighborhood(neighborhood):
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute(f"SELECT mci_category, COUNT(*) as count FROM crime_data WHERE neighbourhood_158 = '{neighborhood}' GROUP BY mci_category")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify([{'mci_category': row[0], 'count': row[1]} for row in results])


### charts3.js:
@app.route('/api/correlation_matrix', methods=['GET'])
def correlation_matrix():
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute("SELECT mci_category, report_year, COUNT(*) as count FROM crime_data GROUP BY mci_category, report_year ORDER BY mci_category, report_year")
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    crime_types = sorted(set(row[0] for row in results))
    years = sorted(set(row[1] for row in results))
    crime_counts = np.zeros((len(crime_types), len(years)))

    for row in results:
        crime_type, year, count = row
        i = crime_types.index(crime_type)
        j = years.index(year)
        crime_counts[i, j] = count

    correlation_matrix = np.corrcoef(crime_counts)
    correlation_matrix = correlation_matrix.tolist()

    data = {crime_types[i]: {crime_types[j]: correlation_matrix[i][j] for j in range(len(crime_types))} for i in range(len(crime_types))}

    return jsonify(data)



@app.route('/static/<path:path>', methods=['GET'])
def static_file(path):
    return app.send_static_file(path)


if __name__ == '__main__':
    app.run(debug=True, port=5001)





