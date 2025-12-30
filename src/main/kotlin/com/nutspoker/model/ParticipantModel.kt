package com.nutspoker.model

import com.nutspoker.enuns.Payment
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.math.BigDecimal

@Entity(name = "participants")
class ParticipantModel(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @Column(name = "player")
    val player: String,

    @Column(name = "buy_in")
    val buyIn: BigDecimal = 10.toBigDecimal(),

    @Column(name = "quantity_rebuy")
    val quantityRebuy: Int = 0,

    @Column(name = "value_rebuy")
    val valueRebuy: BigDecimal = 10.toBigDecimal(),

    @Column(
        name = "total_rebuy",
        insertable = false,
        updatable = false,
    )
    val totalRebuy: BigDecimal? = null,

    @Column(name = "add_on")
    val addOn: BigDecimal = 0.toBigDecimal(),

    @Column(
        name = "total_player",
        insertable = false,
        updatable = false,
    )
    val totalPlayer: BigDecimal? = null,

    @Column(name = "payment")
    @Enumerated(EnumType.STRING)
    val payment: Payment = Payment.FALSE,

    @Column(name = "position")
    val position: Int = 0,

    @Column(name = "session_id")
    var sessionId: String? = null
)



