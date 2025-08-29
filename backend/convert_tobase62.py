import string
def to_base62(num: int) -> str:
    chars = string.digits + string.ascii_letters
    if num == 0:
        num += 1
    base62 = []
    while num > 0:
        num, rem = divmod(num, 62)
        base62.append(chars[rem])
    return "".join(reversed(base62))
