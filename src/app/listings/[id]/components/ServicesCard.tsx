import s from "./business.module.css";

export default function ServicesCard({ services }: { services: string[] }) {
    return (
        <section id="services" className={`${s.card} ${s.anchor}`}>
            <h2 className={s.h2}>Services</h2>
            <ul className={s.services}>
                {services.map((x) => <li key={x}>{x}</li>)}
            </ul>
        </section>
    );
}