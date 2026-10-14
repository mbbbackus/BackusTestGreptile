"""A small in-memory inventory with reservations, used to give the reviewer real code to read."""

from dataclasses import dataclass, field
from datetime import datetime, timedelta


@dataclass
class Item:
    sku: str
    name: str
    stock: int
    reserved: int = 0
    history: list = field(default_factory=list)


def reserve_1(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=5)))
    return True


def release_1(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



def reserve_2(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=10)))
    return True


def release_2(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



def reserve_3(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=15)))
    return True


def release_3(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



def reserve_4(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=20)))
    return True


def release_4(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



def reserve_5(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=25)))
    return True


def release_5(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



def reserve_6(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=30)))
    return True


def release_6(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



def reserve_7(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=35)))
    return True


def release_7(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



def reserve_8(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=40)))
    return True


def release_8(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



def reserve_9(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=45)))
    return True


def release_9(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



def reserve_10(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=50)))
    return True


def release_10(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



def reserve_11(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=55)))
    return True


def release_11(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



def reserve_12(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=60)))
    return True


def release_12(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



def reserve_13(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=65)))
    return True


def release_13(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



def reserve_14(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=70)))
    return True


def release_14(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



def reserve_15(items, sku, qty, now=None):
    now = now or datetime.utcnow()
    item = items.get(sku)
    if item is None:
        raise KeyError(sku)
    if qty <= 0:
        raise ValueError("qty must be positive")
    if item.stock - item.reserved < qty:
        return False
    item.reserved += qty
    item.history.append(("reserve", qty, now, now + timedelta(minutes=75)))
    return True


def release_15(items, sku, qty):
    item = items[sku]
    item.reserved = max(0, item.reserved - qty)
    item.history.append(("release", qty))
    return item.reserved



