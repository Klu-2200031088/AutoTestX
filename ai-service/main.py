from fastapi import FastAPI
from typing import List, Dict, Any
from pydantic import BaseModel

app = FastAPI()

# Simple TestItem model to match the backend data structure
class TestItem(BaseModel):
    testName: str
    filePath: str
    failureRate: float
    executionTime: float
    riskScore: float

@app.get("/")
def read_root():
    return {"message": "AutoTestX AI Service is running"}

@app.post("/prioritize")
async def prioritize_tests(tests: List[TestItem]):
    """
    Accepts a list of test cases and returns them sorted by riskScore in descending order.
    """
    # Simply sort the list based on the 'riskScore' field
    sorted_tests = sorted(tests, key=lambda x: x.riskScore, reverse=True)
    return sorted_tests

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
