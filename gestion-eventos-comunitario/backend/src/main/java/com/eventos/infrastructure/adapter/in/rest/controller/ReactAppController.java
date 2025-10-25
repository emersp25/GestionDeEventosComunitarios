package com.eventos.infrastructure.adapter.in.rest.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ReactAppController {
    @RequestMapping(value = {
            "/",
            "/events",
            "events/create",
            "/reports",
            "/calendar",
            "/registrations",
            "/registrations/create",
            "/budgets",
            "/budgets/create",
            "/login",
            "/register"
    }, method = RequestMethod.GET)
    public String getReactApp() {
        return "forward:/index.html";
    }
}
