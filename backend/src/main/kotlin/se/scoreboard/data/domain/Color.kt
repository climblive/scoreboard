package se.scoreboard.data.domain

import java.io.Serializable
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "color")
open class Color (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    open var organizer: Organizer? = null,

    @Column(name = "name", nullable = false, length = 32, unique = true)
    open var name: String? = null,

    @Column(name = "rgb_primary", length = 7, nullable = false)
    open var rgbPrimary: String? = null,

    @Column(name = "rgb_secondary", length = 7, nullable = true)
    open var rgbSecondary: String? = null,

    @Column(name = "shared")
    open var shared: Boolean? = null) : Serializable, AbstractEntity<Int>