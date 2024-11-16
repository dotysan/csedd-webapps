# Notes on how to use Google BigQuery

Service is here: <https://console.cloud.google.com/bigquery>

You must be a member of this group: <https://groups.google.com/a/measurementlab.net/g/discuss>

Instructions: <https://www.measurementlab.net/data/docs/bq/quickstart/>

Schema: <https://github.com/m-lab/etl-schema>

## Some examples

### Tinkering with the Cloudflare schema

![alt text](images/speedtest_speed1_schema.png)

```sql
-- SELECT cf.serverPoP, COUNT(cf.serverPoP) AS pop_count
-- SELECT cf.clientRegion, COUNT(cf.clientRegion)
SELECT cf.clientCity, COUNT(cf.clientCity) as city_count

FROM `measurement-lab.cloudflare.speedtest_speed1` AS cf

WHERE cf.clientRegion = 'California'
  AND cf.serverPoP in ('LAX', 'SJC', 'SMF', 'LAS', 'SFO', 'PDX')
-- WHERE cf.clientCountry = 'US'
-- WHERE cf.clientCity = 'Twain Harte'
  -- AND cf.date > '2024-01-01'

-- GROUP BY cf.serverPoP
-- GROUP BY cf.clientRegion
GROUP BY cf.clientCity

-- ORDER by pop_count DESC
ORDER by city_count DESC
LIMIT 10
```

![alt text](images/calif_cities.png)

#### Finding Our Cloudflare PoPs

This filters out tests going to PoPs that aren't optimal.

TODO: Why isn't SFO in the list above?

`curl --silent https://speed.cloudflare.com/locations |jq '.[] |select(.cca2 == "US" and .lat > 33 and .lat < 46 and .lon > -125 and .lon < -115)'`

```json
{
  "iata": "LAX",
  "lat": 33.94250107,
  "lon": -118.4079971,
  "cca2": "US",
  "region": "North America",
  "city": "Los Angeles"
}
{
  "iata": "SMF",
  "lat": 38.695400238,
  "lon": -121.591003418,
  "cca2": "US",
  "region": "North America",
  "city": "Sacramento"
}
{
  "iata": "SFO",
  "lat": 37.6189994812,
  "lon": -122.375,
  "cca2": "US",
  "region": "North America",
  "city": "San Francisco"
}
{
  "iata": "SJC",
  "lat": 37.3625984192,
  "lon": -121.929000855,
  "cca2": "US",
  "region": "North America",
  "city": "San Jose"
}
{
  "iata": "LAS",
  "lat": 36.08010101,
  "lon": -115.1520004,
  "cca2": "US",
  "region": "North America",
  "city": "Las Vegas"
}
{
  "iata": "PDX",
  "lat": 45.58869934,
  "lon": -122.5979996,
  "cca2": "US",
  "region": "North America",
  "city": "Portland"
}
```
