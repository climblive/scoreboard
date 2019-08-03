package se.scoreboard.configuration

import com.google.gson.annotations.SerializedName

data class JwtPayload(
        val username: String,

        @SerializedName("cognito:groups")
        val cognitoGroups: List<String>,

        val sub: String,

        val iss: String,

        val version: Int,

        @SerializedName("client_id")
        val clientId: String,

        @SerializedName("event_id")
        val eventId: String,

        @SerializedName("token_use")
        val tokenUse: String,

        val scope: String,

        @SerializedName("auth_time")
        val authTime: Long,

        val exp: Long,

        val iat: Long,

        val jti: String)
