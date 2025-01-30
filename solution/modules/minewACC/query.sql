/*
Here are links to help you get started with Stream Analytics Query Language:
Common query patterns - https://go.microsoft.com/fwLink/?LinkID=619153
Query language - https://docs.microsoft.com/stream-analytics-query/query-language-elements-azure-stream-analytics
*/
SELECT
    *
INTO
    [acceleration]
FROM
    [ACC] TIMESTAMP BY frameTime
HAVING frame.data.x > 0.2 OR frame.data.z > 0.2
