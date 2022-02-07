package se.scoreboard.data.domain

import java.io.Serializable
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "user", uniqueConstraints = arrayOf(UniqueConstraint(columnNames = arrayOf("username"))))
open class User (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @Column(name = "name", nullable = false, length = 32)
    open var name: String? = null,

    @Column(name = "username", unique = true, nullable = false, length = 64)
    open var username: String? = null,

    @Column(name = "admin", nullable = false)
    open var isAdmin: Boolean = false,

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_organizer",
            joinColumns = arrayOf(JoinColumn(name = "user_id", nullable = false, updatable = false)),
            inverseJoinColumns = arrayOf(JoinColumn(name = "organizer_id", nullable = false, updatable = false)))
    open var organizers: MutableList<Organizer> = mutableListOf()) : Serializable, AbstractEntity<Int>