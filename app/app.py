from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from marks import Mark

app = Flask(__name__)
CORS(app)

current_marks = {}


@app.route('/', methods=['GET'])
@cross_origin()
def start():
    return app.send_static_file('index.html')


@app.route('/api/create_mark', methods=['POST'])
@cross_origin()
def create_mark():
    new_mark = request.get_json()
    current_marks[new_mark['id']] = Mark(new_mark['id'],
                                         new_mark['coord'], new_mark['data'])
    return 'new mark created'


@app.route('/api/delete_mark', methods=['POST'])
@cross_origin()
def delete_mark():
    mark_id = request.get_json()
    del current_marks[mark_id['id']]
    return 'mark deleted'


@app.route('/api/get_marks', methods=['POST'])
@cross_origin()
def get_marks():
    marks_response = {}
    marks_response['marks'] = []
    for i in current_marks.keys():
        marks_response['marks'].append(current_marks[i].to_json(i))
    return jsonify(marks_response)
