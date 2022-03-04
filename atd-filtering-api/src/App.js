import "./App.css";
import { useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

function App() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);

  const getData = async () => {
    try {
      const {
        data: { data },
      } = await axios.get(
        `https://global.atdtravel.com/api/products?geo=en&offset=${offset}&limit=${limit}&title=${title}`
      );
      setData(data);
      setError("");
    } catch (err) {
      return setError(err.message);
    }
  };

  const handleTyping = (event) => {
    return setTitle(event.target.value);
  };

  const handlePreviousPage = () => {
    setLimit(limit - 10);
    setOffset(offset - 10);
    getData();
  };

  const handleNextPage = () => {
    setOffset(offset + 10);
    setLimit(limit + 10);
    getData();
  };
  return (
    <>
      <Container>
        <h1>Product search</h1>
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
              onClick={getData}
            >
              Search
            </Button>
          )}
        </InputGroup>
        <br />
        {error.length > 0 ? <h1>Title do not exist!</h1> : ""}
        {data.length ? (
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
              {data.map((advert) => {
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
        ) : (
          ""
        )}
        <br />
        {!data.length ? (
          ""
        ) : (
          <>
            <Button variant="info" onClick={handlePreviousPage} size="lg">
              Previous page
            </Button>
            <Button variant="primary" onClick={handleNextPage} size="lg">
              Next page
            </Button>
          </>
        )}
        <br />
      </Container>
    </>
  );
}

export default App;
