# Zenboost Backend Project

## Description

This repository implements the backend for a web application simulating a purchase experience for ZenBoost. It calculates a dynamic discount for users based on estimated purchasing power and provides it as a RESTful API.

## Installation

1. **Prerequisites:** Ensure you have Node.js and npm (or yarn) installed.
2. **Clone the repository:** `git clone https://github.com/RuSh991/zenboost-backend.git`
3. **Install dependencies:** `npm install` or `npm i` (or `yarn install`)
4. **Run the project:** `node server.js`

## Usage

- **API Endpoints:**
  - `/api/calculate-discount`: For calculating discount
  - `/`: Default route for the root URL - Health check

## Notes

The `income_by_zip.json` file stores the US zip code corresponding to its average income in key value pairs. The data is fetched from https://data.census.gov/

## Technologies

- Node.js
- Express.js
