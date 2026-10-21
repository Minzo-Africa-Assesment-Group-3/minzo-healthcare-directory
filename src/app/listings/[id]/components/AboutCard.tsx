import s from "./business.module.css";

export default function AboutCard({ about }: { about: string }) {
    return (
        <section id="overview" className={`${s.card} ${s.anchor}`}>
            <h2 className={s.h2}>About</h2>
            <p className={s.about}>{about}</p>
        </section>
    );
}