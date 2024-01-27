import { useState, useEffect } from 'react'
import { fetchEventSource } from "@microsoft/fetch-event-source";

function App() {
  const [data, setData] = useState([]);
  
  const serverBaseURL = "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      await fetchEventSource(`${serverBaseURL}/sse`, {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
        },
        onopen(res) {
          if (res.ok && res.status === 200) {
            console.log("Connection made ", res);
          } else if (
            res.status >= 400 &&
            res.status < 500 &&
            res.status !== 429
          ) {
            console.log("Client side error ", res);
          }
        },
        onmessage(event) {
          console.log(event.data);
          const parsedData = JSON.parse(event.data);
          setData((data) => [...data, parsedData]);
        },
        onclose() {
          console.log("Connection closed by the server");
        },
        onerror(err) {
          console.log("There was an error from server", err);
        },
      });
    };
    fetchData();
  }, []);

  return (
    <div className="columns mt-5 is-centered">
        <div className="column is-half">
          <h2 className='has-text-centered is-size-2 mb-3'>Dummy StockMarket</h2>
          <table className='table is-is-striped is-fullwidth'>
            <thead>
              <tr>
                <th>Time</th>
                <th>StockMarket A</th>
                <th>StockMarket B</th>
              </tr>
            </thead>
            <tbody>
               {data.map((item, index) => {
                const {time, aTechStockPrice, bTechStockPrice} = item
                return (
                <tr key={index}>
                  <td>{time}</td>
                  <td>${aTechStockPrice}</td>
                  <td>${bTechStockPrice}</td>
                </tr>)
              })}
            </tbody>
          </table>
        </div>
    </div>
  )
}

export default App
