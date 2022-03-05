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
  const [title, setTitle] = useState("");
  const [error, setError] = useState([]);

  const getData = async () => {
    try {
      const {
        data: { data },
        data: { meta },
      } = await axios.get(
        `https://global.atdtravel.com/api/products?geo=en&offset=${offset}&limit=10&title=${title}`
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
    if (error.length > 0) {
      setOffset(0);
    }
    setOffset(offset + 10);
    getData();
    setNewData([]);
  };

  return (
    <>
      <Container>
        <div className="centering-div">
          <h1 className="result-text">Product search</h1>
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
          <br />
          {newData.length > 0 ? (
            <h1 className="result-text">{meta.total_count} results found</h1>
          ) : (
            ""
          )}
        </div>

        <br />
        {error ? (
          <div className="centering-div">
            <h1 className="result-text">{error.err_desc}</h1>
          </div>
        ) : (
          ""
        )}
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
                    {advert.price_from_child.length < 1
                      ? "Child tickets from: N/A"
                      : `Child tickets from: ${advert.price_from_child}
                    ${meta.sale_cur}`}
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </div>
        <br />
        <div className="button">
          {offset < meta.total_count ? (
            <Button variant="primary" onClick={handleNextPage} size="lg">
              More results
            </Button>
          ) : (
            ""
          )}
          {offset > meta.total_count ? (
            <h1 className="result-text">
              You reached all {meta.total_count} results for this search!
            </h1>
          ) : (
            ""
          )}
          <br />
        </div>
      </Container>
    </>
  );
}

export default App;
