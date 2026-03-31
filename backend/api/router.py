from fastapi.routing import APIRouter
from modules.auth.api import router as auth_router
from modules.realestate.appartment.api import router as appartment_router
from modules.realestate.building.api import router as building_router
from modules.realestate.office.api import router as office_router
from modules.storage.api import router as storage_router
from modules.finance.account.api import router as account_router
from modules.finance.envelope.api import router as envelope_router
from modules.finance.paymentin.api import router as paymentin_router
from modules.finance.paymentout.api import router as paymentout_router

api_router = APIRouter()
URL_PREFIX = "/api/v1"

api_router.include_router(auth_router, prefix=URL_PREFIX + "/auth", tags=["auth"])
api_router.include_router(appartment_router, prefix=URL_PREFIX + "/appartments", tags=["appartments"])
api_router.include_router(building_router, prefix=URL_PREFIX + "/buildings", tags=["buildings"])
api_router.include_router(office_router, prefix=URL_PREFIX + "/offices", tags=["offices"])
api_router.include_router(storage_router, prefix=URL_PREFIX + "/storage", tags=["storage"])
api_router.include_router(account_router, prefix=URL_PREFIX + "/finance/accounts", tags=["finance"])
api_router.include_router(envelope_router, prefix=URL_PREFIX + "/finance/envelopes", tags=["finance"])
api_router.include_router(paymentin_router, prefix=URL_PREFIX + "/finance/payments-in", tags=["finance"])
api_router.include_router(paymentout_router, prefix=URL_PREFIX + "/finance/payments-out", tags=["finance"])