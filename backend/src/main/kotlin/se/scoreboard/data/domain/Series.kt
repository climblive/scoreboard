package se.scoreboard.data.domain

import java.io.Serializable
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "series")
open class Series (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    open var organizer: Organizer? = null,

    @Column(name = "name", nullable = false, length = 64)
    open var name: String? = null,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "series")
    open var contests: MutableList<Contest> = mutableListOf()) : Serializable, AbstractEntity<Int>
