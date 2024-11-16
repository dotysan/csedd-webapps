# Notes on how to use Google BigQuery

Service is here: <https://console.cloud.google.com/bigquery>

You must be a member of this group: <https://groups.google.com/a/measurementlab.net/g/discuss>

Instructions: <https://www.measurementlab.net/data/docs/bq/quickstart/>

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
