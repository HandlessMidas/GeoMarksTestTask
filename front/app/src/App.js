import React from "react";
import "./App.css";
import "./";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import uuid from "react-uuid";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.setMarks = this.setMarks.bind(this);

    this.state = {
      marks: [],
    };

    this.mapData = {
      center: [59.9311, 30.3609],
      zoom: 11,
    };

    this.notification = this.props.notification;
  }

  sendRequest(url, parse, body) {
    fetch("http://127.0.0.1:5000" + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((response) => parse(response))
      .catch((error) => error);
  }

  processResponse(response) {}

  generateID() {
    return uuid();
  }

  clickOnMap(event) {
    var data =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    var id = this.generateID();
    this.setState({
      marks: [
        ...this.state.marks,
        { coord: event.get("coords"), data: data, id: id },
      ],
    });
    this.sendRequest("/api/create_mark", this.processResponse, {
      coord: event.get("coords"),
      data: data,
      id: id,
    });
  }

  componentDidMount() {
    this.sendRequest("/api/get_marks", this.setMarks, {});
  }

  setMarks(response) {
    this.setState({ marks: response.marks });
  }

  deleteMark(mark) {
    this.sendRequest("/api/delete_mark", this.processResponse, {
      id: mark.id,
    });
  }

  render() {
    return (
      <div className="map">
        <YMaps className="mapWindow">
          <Map
            onClick={this.clickOnMap.bind(this)}
            defaultState={this.mapData}
            height={1000}
            width={1000}
          >
            {this.state.marks.map((mark) => (
              <Placemark
                key={mark.id}
                geometry={mark.coord}
                properties={{
                  balloonContent: mark.data,
                }}
                modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
              />
            ))}
          </Map>
        </YMaps>
      </div>
    );
  }
}

export default App;
