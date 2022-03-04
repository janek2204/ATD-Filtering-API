import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

function App() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");

  const getData = async () => {
    const {
      data: { data },
    } = await axios.get(
      `https://global.atdtravel.com/api/products?geo=en&title=${title}`
    );
    console.log(data);
  };

  const handleChange = (event) => {
    return setTitle(event.target.value);
  };

  console.log(title);
  return (
    <Container>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Type here...."
          aria-describedby="basic-addon2"
          onChange={handleChange}
        />
        <Button
          variant="outline-secondary"
          id="button-addon2"
          onClick={getData}
        >
          Search
        </Button>
      </InputGroup>
    </Container>
  );
}

export default App;
