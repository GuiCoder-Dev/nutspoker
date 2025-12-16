package com.nutspoker.controller

import com.nutspoker.controller.request.PutBlindRequest
import com.nutspoker.controller.response.BlindLoadResponse
import com.nutspoker.extesion.toBlindLoadResponse
import com.nutspoker.extesion.toBlindModel
import com.nutspoker.repository.BlindRepository
import com.nutspoker.service.BlindService
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/blinds")
class BlindController(
    private val blindService: BlindService,
    private val blindRepository: BlindRepository
) {

    @PostMapping("/add")
    fun createNewBlind(){
        blindService.newBlind()
    }

    @GetMapping("/load")
    fun loadBlinds(): List<BlindLoadResponse>{
        return blindService.blindsLoad().map {it.toBlindLoadResponse()}
    }

    @PutMapping("/update/{id}")
    fun updateBlinds(@PathVariable id: Int, @RequestBody @Valid blindUpdate: PutBlindRequest){
        val blind = blindRepository.findById(id).orElseThrow()
        blindService.update(blindUpdate.toBlindModel(blind))
    }

    @DeleteMapping("/delete/{id}")
    fun deleteBlindsAndBreaks(@PathVariable id: Int){
        val blindModel = blindRepository.findById(id).orElseThrow()
        blindService.delete(blindModel)
    }


}