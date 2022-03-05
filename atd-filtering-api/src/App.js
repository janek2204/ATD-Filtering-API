import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";

function App() {
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [meta, setMeta] = useState([]);

  console.log("data --->", data);
  console.log("new data ---->", newData);
  console.log("offset --->", offset);
  console.log("meta count----->", meta.total_count);

  const [title, setTitle] = useState("");
  const [error, setError] = useState([]);

  const getData = async () => {
    try {
      const {
        data: { data },
        data: { meta },
      } = await axios.get(
        `https://global.atdtravel.com/api/products?geo=en&offset=${offset}&limit=1&title=${title}`
      );
      setMeta(meta);
      if (newData.length > 0) {
        return setData(data);
      }
      setNewData(data);
    } catch (err) {
      return setError(err.response.data);
    }
    setError([]);
  };

  useEffect(() => {
    setNewData(newData.concat(data));
  }, [data]);

  const handleTyping = (event) => {
    setTitle(event.target.value);
    setOffset(0);
  };

  const handleNextPage = () => {
    setOffset(offset + 10);
    getData();
  };

  const handleSearch = () => {
    setOffset(offset + 10);
    getData();
    setNewData([]);
  };

  return (
    <>
      <Container>
        <div className="centering-div">
          <h1 className="result-text">Product search</h1>
          <h1></h1>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Type here...."
              aria-describedby="basic-addon2"
              onChange={handleTyping}
            />
            {title.length <= 0 ? (
              ""
            ) : (
              <Button
                variant="outline-secondary"
                id="button-addon2"
                onClick={handleSearch}
              >
                Search
              </Button>
            )}
          </InputGroup>
        </div>

        <br />
        {error ? <h1 className="result-text">{error.err_desc}</h1> : ""}
        <div className="cards-container">
          {newData.map((advert) => {
            return (
              <Card
                className="bg-dark text-white"
                style={{ width: "20rem" }}
                key={advert.id}
              >
                <Card.Img
                  variant="top"
                  src={advert.img_sml}
                  alt={advert.dest}
                  style={{
                    minWidth: "19rem",
                    minHeight: "15rem",
                  }}
                />
                <Card.Body>
                  <Card.Title>{advert.title}</Card.Title>
                  <Card.Text>City: {advert.dest}</Card.Text>
                  <Card.Text>
                    Adult tikcets from: {advert.price_from_adult}{" "}
                    {meta.sale_cur}
                  </Card.Text>
                  <Card.Text>
                    Child tickets from: {advert.price_from_child}{" "}
                    {meta.sale_cur}
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </div>
        <br />
        <div className="button">
          <button onClick={handleNextPage}>clik</button>
        </div>
        <br />
      </Container>
    </>
  );
}

export default App;
