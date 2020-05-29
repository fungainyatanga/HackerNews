import React, { Component } from "react";
import Table from "./components/Table";
import Search from "./components/Search";
import { PATH_BASE, PATH_SEARCH, PARAM_SEARCH, PARAM_PAGE, PARAM_HPP } from "./Utils/Api";
import "./App.css";

const DEFAULT_QUERY = "react";
const DEFAULT_HPP = '100';

class App extends Component {
  constructor(props) {
    super(props);
    //initialize list and use from local state
    this.state = {
      results: null,
      searchKey:'',
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories(result) {
    const { hits, page } = result;

    const oldHits = page !== 0 ? this.state.results.hits : [];

    const updatedHits = [
      ...oldHits,
      ...hits 
    ];

    this.setState({
      result: {hits: updatedHits, page}
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then((response) => response.json())
      .then((result) => this.setSearchTopStories(result))
      .catch((error) => error);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value,
    });
  }
  onDismiss(id) {
    const isNotId = (item) => item.objectID !== id;
    const updatedHits = this.state.results.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.results, hits: updatedHits },
    });
  }
  render() {
    const { searchTerm, results: result } = this.state;
    const page = (result && result.page) || 0;
    return (
      <div className="App">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSearchSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {result && <Table list={result.hits} onDismiss={this.onDismiss} />}
        <div className="interactions">
          <button
            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}
          >
            More
          </button>
        </div>
      </div>
    );
  }
}

export default App;
