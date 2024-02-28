package se.scoreboard.data.domain

import java.io.Serializable
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "problem", uniqueConstraints = arrayOf(UniqueConstraint(columnNames = arrayOf("number", "contest_id"))))
open class Problem (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    open var organizer: Organizer? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id", nullable = false)
    open var contest: Contest? = null,

    @Column(name = "number", nullable = false)
    open var number: Int = 0,

    @Column(name = "hold_color_primary", nullable = true, length = 7)
    open var holdColorPrimary: String? = null,

    @Column(name = "hold_color_secondary", nullable = true, length = 7)
    open var holdColorSecondary: String? = null,

    @Column(name = "name", nullable = true, length = 64)
    open var name: String? = null,

    @Column(name = "description", length = 1024)
    open var description: String? = null,

    @Column(name = "points", nullable = false)
    open var points: Int = 0,

    @Column(name = "flash_bonus")
    open var flashBonus: Int? = null,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "problem")
    open var ticks: MutableList<Tick> = mutableListOf()) : Serializable, AbstractEntity<Int>