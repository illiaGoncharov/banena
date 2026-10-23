#!/usr/bin/env python3
"""Install acme.sh Let's Encrypt cert into reg.ru ISPmanager.

Uses field names that Host-Lite accepts: crt, key, ca.
Env: ISP_PANEL, ISP_USER, ISP_PASSWORD; optional CERT_DIR.
"""
from __future__ import annotations

import json
import os
import pathlib
import ssl
import time
import urllib.parse
import urllib.request

panel = os.environ.get("ISP_PANEL", "https://server44.hosting.reg.ru:1500").rstrip("/") + "/ispmgr"
auth = f"{os.environ['ISP_USER']}:{os.environ['ISP_PASSWORD']}"
cert_dir = pathlib.Path(
    os.environ.get("CERT_DIR", str(pathlib.Path.home() / ".acme.sh/banena.ru"))
)
ctx = ssl._create_unverified_context()


def call(**kwargs: str) -> dict:
    data = {"authinfo": auth, "out": "json", **kwargs}
    body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(panel, data=body, method="POST")
    with urllib.request.urlopen(req, context=ctx, timeout=90) as resp:
        return json.loads(resp.read().decode())


def main() -> None:
    crt = (cert_dir / "banena.ru.cer").read_text()
    key = (cert_dir / "banena.ru.key").read_text()
    ca = (cert_dir / "ca.cer").read_text()

    call(func="webdomain.edit", elid="banena.ru", sok="ok", secure="off")
    time.sleep(1)
    for e in call(func="sslcert").get("doc", {}).get("elem", []) or []:
        call(func="sslcert.delete", elid=e["name"]["$"], sok="ok")

    r = call(
        func="sslcert.add",
        sok="ok",
        crttype="existing",
        name="banena-le",
        crt=crt,
        key=key,
        ca=ca,
    )
    if r.get("doc", {}).get("error"):
        raise SystemExit(r["doc"]["error"])

    name = call(func="sslcert")["doc"]["elem"][0]["name"]["$"]
    call(
        func="webdomain.edit",
        elid="banena.ru",
        sok="ok",
        secure="on",
        ssl_cert=name,
    )
    call(func="webdomain.resume", elid="banena.ru", sok="ok")
    print("installed", name)


if __name__ == "__main__":
    main()
