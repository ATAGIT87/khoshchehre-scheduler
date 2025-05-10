const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = "Reservations";

exports.handler = async (event) => {
  const { firstName, lastName, timeSlot } = JSON.parse(event.body);

  if (!firstName || !lastName || !timeSlot) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields" })
    };
  }

  try {
    // Check if the timeSlot is already reserved
    const getParams = {
      TableName: TABLE_NAME,
      Key: { timeSlot }
    };

    const existingReservation = await dynamoDb.get(getParams).promise();

    if (existingReservation.Item) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: "Time slot already reserved" })
      };
    }

    // Save the new reservation
    const putParams = {
      TableName: TABLE_NAME,
      Item: { timeSlot, firstName, lastName }
    };

    await dynamoDb.put(putParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Reservation successful" })
    };

  } catch (error) {
    console.error("Error reserving slot: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};
