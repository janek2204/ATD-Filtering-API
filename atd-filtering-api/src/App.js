import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Spiner from "react-bootstrap/Spinner";

function App() {
  const [dataFromRequest, setDataFromRequest] = useState([]); // setting all data coming from api response.
  const [newData, setNewData] = useState([]); // state for new data to be concat with coming data from new request.
  const [offset, setOffset] = useState(0); // state for offset.
  const [meta, setMeta] = useState([]); // state for meta header from api response. containes offset,limit, currency and total count for search.
  const [title, setTitle] = useState(""); // state for title typed in search box.
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false); // state for loading spinner.

  const getData = async () => {
    //* function to manage with fetching data from api. I used this function outside of useEffect in puropse to prevent running it while site is loaded for first time.
    setLoading(true); // changing state of spinner.
    setOffset(offset + 10); // every time getData will be called offset will be incresed by 10.
    try {
      // try and catch block for error handeling and preventing app from crushing.
      const {
        data: { data }, // deconstructing response.
        data: { meta },
      } = await axios.get(
        `https://global.atdtravel.com/api/products?geo=en&offset=${offset}&limit=10&title=${title}`
      );
      setLoading(false); // when promise is resolved, state of spinner is changed.
      setMeta(meta); // seting meta header to meta state.
      if (newData.length > 0) {
        return setDataFromRequest(data); // when newData already exists, data from response is saved into data state.
      }
      setNewData(data); // when there is no newData yet, data state is saved into newData.
    } catch (err) {
      setLoading(false); // if error occures, changing state of loading spinner.
      return setError(err.response.data); // returning error if occures, and saving message from error response to display.
    }
    setError([]); // every time functions starts again is reseting error to its original state , empty array.
  };

  useEffect(() => {
    //* useEffect in this occasion to save merge new data coming from request and what ever is already displayed.
    setNewData(newData.concat(dataFromRequest)); // setting newData state to new array.
  }, [dataFromRequest]); // when data state changes, the useeffect is running above function.

  const handleTyping = (event) => {
    // handeling search box typing.
    setTitle(event.target.value); // setting title to whatever is typed in the search box. To use later into api call
    setOffset(0); // while starting typing into box, offset is restarted to original value. Preparing api request string for new call.
  };

  const handleSearch = () => {
    // search button handler
    if (error.length > 0) {
      // to manage dispalying error message if previous call was a bad request.
      setOffset(0);
    }
    getData();
    setNewData([]); // setting newData into its original state to be ready for new request comming in.
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
            {title.length <= 0 ? ( // if there is no text in the box, search button won't apear.
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
          {newData.length > 0 ? ( // if request has data in it, will show how many results are for the this search.
            <h1 className="result-text">{meta.total_count} results found</h1>
          ) : (
            ""
          )}
        </div>
        <br />
        {error ? ( // if error, error message from response will be displayed. Otherwise, cards with adverts will be rendered.
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
        {!loading ? ( // if loading is true, spinner will be present, if false spinner disapears.
          ""
        ) : (
          <div className="spinner">
            <Spiner animation="border" role="status" />
          </div>
        )}
        <div className="button">
          {offset < meta.total_count && error.length === 0 ? ( // button just dispalyed while offset is smaller than  total count of adverts for current requests and there is no errors. both conditions has to be true.
            <Button variant="primary" onClick={getData} size="lg">
              More results
            </Button>
          ) : (
            ""
          )}
          {offset > meta.total_count ? ( // if offset is bigger than total count of adverts for current requests message will be dispalyed.
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
