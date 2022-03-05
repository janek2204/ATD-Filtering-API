import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

function App() {
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState([]);

  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const [meta, setMeta] = useState([]);
  const [filtering, setFiltering] = useState([]);

  const getData = async () => {
    try {
      const {
        data: { data },
        data: { meta },
      } = await axios.get(
        `https://global.atdtravel.com/api/products?geo=en&offset=${offset}&limit=10`
      );
      if (newData.length <= 0) setNewData(data);
      else setData(data);
      setMeta(meta);
    } catch (err) {
      return setError(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, [offset]);

  const handleTyping = (event) => {
    setTitle(event.target.value);
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
      }
    });
    setFiltering(filter);
  };

  return (
    <>
      <Container>
        <h1>Product search</h1>
        <p>newData length {newData.length}</p>
        <p>offset {offset}</p>
        <p>Filtering array length: {filtering.length}</p>
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
              onClick={handleFiltering}
            >
              Search
            </Button>
          )}
        </InputGroup>
        <br />
        {error.length > 0 ? <h1>Title do not exist!</h1> : ""}
        {!filtering.length ? (
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Destination</th>
                <th>
                  Adult: <br />
                  Price From
                </th>
                <th>
                  Child: <br /> Price From
                </th>
              </tr>
            </thead>
            <tbody>
              {newData.length <= 0
                ? data.map((advert) => {
                    return (
                      <tr key={advert.id}>
                        <td>
                          <img src={advert.img_sml} alt={advert.dest} />
                        </td>
                        <td>{advert.title}</td>
                        <td>{advert.dest}</td>
                        <td>{advert.price_from_adult}</td>
                        <td>
                          {!advert.price_from_child
                            ? "N/A"
                            : advert.price_from_child}
                        </td>
                      </tr>
                    );
                  })
                : newData.map((advert) => {
                    return (
                      <tr key={advert.id}>
                        <td>
                          <img src={advert.img_sml} alt={advert.dest} />
                        </td>
                        <td>{advert.title}</td>
                        <td>{advert.dest}</td>
                        <td>{advert.price_from_adult}</td>
                        <td>
                          {!advert.price_from_child
                            ? "N/A"
                            : advert.price_from_child}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </Table>
        ) : (
          <>
            <h1>We have {filtering.length} atractions for you!</h1> <br />
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Destination</th>
                  <th>
                    Adult: <br />
                    Price From
                  </th>
                  <th>
                    Child: <br /> Price From
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtering.map((advert) => {
                  return (
                    <tr key={advert.id}>
                      <td>
                        <img src={advert.img_sml} alt={advert.dest} />
                      </td>
                      <td>{advert.title}</td>
                      <td>{advert.dest}</td>
                      <td>{advert.price_from_adult}</td>
                      <td>
                        {!advert.price_from_child.length
                          ? "N/A"
                          : advert.price_from_child}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
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
