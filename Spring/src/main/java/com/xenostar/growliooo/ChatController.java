package com.xenostar.growliooo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/stock")
public class ChatController {

    @Autowired
   private NewsAgentService newsAgentService;


    @GetMapping("/ask")
    public String ask(@RequestParam String company){
        return newsAgentService.analyzeCompany(company);
    }




}
