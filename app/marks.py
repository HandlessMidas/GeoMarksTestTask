class Mark:
    def __init__(self, mark_id, coord, data=''):
        self.coord = coord
        self.data = data
        self.id = mark_id

    def to_json(self, id):
        json_mark = {}
        json_mark['id'] = self.id
        json_mark['coord'] = self.coord
        json_mark['data'] = self.data
        return json_mark
