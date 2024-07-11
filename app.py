import stripe
import uvicorn
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

stripe.api_key = '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'

@app.get("/")
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/success")
async def success(request: Request):
    return templates.TemplateResponse("success.html", {"request": request})

@app.get("/cancel")
async def cancel(request: Request):
    return templates.TemplateResponse("cancel.html", {"request": request})

@app.post("/create-checkout-session")
async def create_checkout_session(request: Request):
    data = await request.json()

    checkout_session = stripe.checkout.Session.create(
        success_url="http://localhost:8001/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url="http://localhost:8001/cancel",
        payment_method_types=["card"],
        mode="subscription",
        line_items=[{
            "price": data["priceId"],
            "quantity": 1
        }],
    )
    return {"sessionId": checkout_session["id"]}

@app.post("/create-portal-session")
async def create_portal_session():
    session = stripe.billing_portal.Session.create(
        return_url="http://localhost:8001"
    )
    return {"url": session.url}

if __name__ == '__main__':
    uvicorn.run("app:app", port=8001, reload=True)
