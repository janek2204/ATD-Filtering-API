import "./App.css";
import { useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

function App() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [limit, setLimit] = useState(10);

  const getData = async () => {
    const {
      data: { data },
    } = await axios.get(
      `https://global.atdtravel.com/api/products?geo=en&limit=${limit}&title=${title}`
    );
    console.log(data);
  };

  const handleTyping = (event) => {
    return setTitle(event.target.value);
  };

  const handleLimit = () => {
    setLimit(limit + 1);
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
          <Button
            variant="outline-secondary"
            id="button-addon2"
            onClick={getData}
          >
            Search
          </Button>
        </InputGroup>
        <br />
        <Button variant="info" onClick={handleLimit}>
          Load More Events
        </Button>
      </Container>
    </>
  );
}

export default App;
