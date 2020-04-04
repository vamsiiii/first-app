import React from "react";
import ReactDOM from 'react-dom'
import Autosuggest from 'react-autosuggest'
import axios from 'axios'
import { debounce } from 'throttle-debounce'
import Chart  from "./BarChart"
import App from "./lineChart"
// import lineChild from "./Chart_Child"
import Zoom from "./new_zoom"
import './styles.css'
import { BrowserRouter, Route, Link, Router } from "react-router-dom";
import { zoom } from "d3";
import Test_Zoom from "./test_zoom"
import Test_Zoom_Child from "./test_zoom_child";



export class AutoComplete extends React.Component {
  
  state = {
    value: '',
    suggestions: [],
    result: ''
  }

  
  componentWillMount() {
    this.onSuggestionsFetchRequested = debounce(
      500,
      this.onSuggestionsFetchRequested
    )
  }


  

  renderSuggestion = suggestion => {
    return (
      <div className="result">
        <div>{suggestion.Country}</div>
        <div className="shortCode">{suggestion.HSName}</div>
      </div>
    )
  }

  //  onChange = (event, { newValue }) => {
  //    this.setState({ value: newValue })
  // }

  onChange = (event, { newValue }) => {
    this.setState({
        value: typeof newValue !== 'undefined' ? newValue : '',
    });
};

  onSuggestionsFetchRequested = ({ value }) => {
    axios
      .post('http://159.65.150.184:9200/hello_trade_analytica/_search', {
        query: {
          multi_match: {
            query: value,
            fields: ['Country.raw','HSName.raw']
          }
        },
        sort: ['_score']
      })
      .then(res => {
        const results = res.data.hits.hits.map(h => h._source)

        this.setState({ suggestions: results })
        // JSON.stringify(results)
        results.map((result) => {
        this.setState({ result: result.data })
        console.log(this.state.result)
    });
  });
}
  

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] })
  }

  onSuggestionSelected= (event, { method }) => {
    const answer = this.state.result
    
    function clickHandler()
    {
      const mohan = []
      for(var i in answer)
      {
         mohan.push({ "year":i , "value":answer[i] })      
      }
      // console.log("Clicked")
        
      function call()
      {
        console.log("hello")
      }
        return(
          <BrowserRouter>
            <Route path="/">
              <button onClick = {call}>Hello</button>
            {/* <Zoom data = {mohan}/> */}
            </Route>
      </BrowserRouter>
          )
          
    }

    if (method === 'enter' || 'click' ) {
      
      event.preventDefault()
      clickHandler()

      
      
    }
  }

  render() {
    const { value, suggestions } = this.state

    const inputProps = {
      placeholder: 'Variable Name',
      value,
      onChange: this.onChange
    }
    
    // console.log(answer[1951])
    // console.log(String(answer[1951]))

    // const myObjStr = JSON.stringify(answer);
    // const obj = JSON.parse(myObjStr)
    //console.log(obj)
    // console.log(myObjStr);
    // const x = JSON.parse(myObjStr)
    // console.log(x);
    // console.log(typeof(myObjStr))
    // var count = Object.keys(obj).length;
      //  const mohan = []
      // for(var i in answer)
      // {
  // //   answer.map((d,i) => {
        //  mohan.push({ "year":i , "value":answer[i] })      }
  // //   }) 
  const answer = this.state.result
  console.log(answer)
  const mohan = []
      for(var i in answer)
      {
         mohan.push({ "year":i , "value":answer[i] })      
      }

console.log(mohan)

    return (
      
      <div className="App">
        <h1>Search</h1>
        
       

        
         <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={suggestion => suggestion.variableName}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={this.onSuggestionSelected}
        ></Autosuggest> 
       


         {/* <Test_Zoom data={mohan} /> */}
            
            <Test_Zoom data={mohan} width = {2000} height = {100}>
           
            </Test_Zoom>
            
        </div>
        
    )
  }
}


const rootElement = document.getElementById('root')
ReactDOM.render(<AutoComplete />, rootElement)

