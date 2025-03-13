process.env.NODE_ENV = "test";

import { test} from "@playwright/test";

import health from "./health.test";
import userTestCollection from "./user.test";

import { connectToDatabase, disconnectFromDatabase } from "../src/repository/database";

import {userModel} from "../src/models/userModel";
import {productModel} from "../src/models/productModel";

import DotenvFlow from "dotenv-flow";
DotenvFlow.config();

function setup(){
    // Before each test clean the database
    test.beforeEach(async ()=> {
        try {
            await connectToDatabase();
            await userModel.deleteMany({});
            await productModel.deleteMany({});

        }
        finally{
            await disconnectFromDatabase();
        }
    })
    // After all test clear the database
    test.afterAll(async ()=> {
        try {
            await connectToDatabase();
            await userModel.deleteMany({});
            await productModel.deleteMany({});

        }
        finally{
            await disconnectFromDatabase();
        }
    })
}

setup();

test.describe(health);
test.describe(userTestCollection);