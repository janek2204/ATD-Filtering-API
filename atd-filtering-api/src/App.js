import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function App() {
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const [filtering, setFiltering] = useState([]);

  const currency = "£";

  useEffect(() => {
    const getData = async () => {
      try {
        const {
          data: { data },
        } = await axios.get(
          `https://global.atdtravel.com/api/products?geo=en&offset=${offset}&limit=10`
        );
        if (newData.length <= 0) setNewData(data);
        else setData(data);
      } catch (err) {
        return setError(err.message);
      }
    };
    getData();
  }, [offset]);

  const handleTyping = (event) => {
    setTitle(event.target.value);
    handleFiltering();
  };

  const handleNextPage = () => {
    setOffset((offset) => offset + 10);
    setNewData(newData.concat(data));
  };

  const handleFiltering = () => {
    const toLower = title.toLowerCase();
    const filter = newData.filter((advert) => {
      const advertToLower = advert.title.toLowerCase();

      if (advertToLower.includes(toLower)) {
        return advert;
      } else return false;
    });
    setFiltering(filter);
  };

  return (
    <>
      <Container>
        <div className="input">
          <h1 className="text">Product search</h1>
          <FormControl
            placeholder="Type here...."
            aria-describedby="basic-addon2"
            onChange={handleTyping}
          />
        </div>

        <br />
        {error.length > 0 ? <h1>Something went wrong!</h1> : ""}
        {!title.length ? (
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
                      Adult tikcets from: {advert.price_from_adult}
                      {currency}
                    </Card.Text>
                    <Card.Text>
                      Child tickets from: {advert.price_from_child}
                      {currency}
                    </Card.Text>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        ) : (
          <>
            <div className="input">
              <h2 className="text">
                We have {filtering.length} atractions for you!
              </h2>
            </div>
            <br />
            <div className="cards-container">
              {filtering.map((advert) => {
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
                        Adult tikcets from: {advert.price_from_adult}
                        {currency}
                      </Card.Text>
                      <Card.Text>
                        Child tickets from: {advert.price_from_child}
                        {currency}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          </>
        )}
        <br />
        <div className="pagination-buttons">
          <Button variant="primary" onClick={handleNextPage} size="lg">
            More results
          </Button>
        </div>
        <br />
      </Container>
    </>
  );
}

export default App;
