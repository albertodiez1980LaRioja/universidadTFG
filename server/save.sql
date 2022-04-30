--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1)

-- Started on 2022-04-30 18:23:22 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3075 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 211 (class 1259 OID 16649)
-- Name: alarms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alarms (
    date_time timestamp without time zone NOT NULL,
    latitude bigint NOT NULL,
    longitude bigint NOT NULL,
    id_sensor integer NOT NULL,
    dni_operator_acussated character varying
);


ALTER TABLE public.alarms OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 16453)
-- Name: measurements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.measurements (
    date_time timestamp without time zone NOT NULL,
    latitude integer NOT NULL,
    longitude integer NOT NULL,
    binary_values integer NOT NULL,
    has_persons boolean NOT NULL,
    has_sound boolean NOT NULL,
    has_gas boolean NOT NULL,
    has_oil boolean NOT NULL,
    has_rain boolean NOT NULL,
    temperature integer NOT NULL,
    humidity integer NOT NULL
);


ALTER TABLE public.measurements OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16525)
-- Name: o_p; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.o_p (
    dni character varying NOT NULL,
    latitude integer NOT NULL,
    longitude integer NOT NULL
);


ALTER TABLE public.o_p OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16495)
-- Name: operators; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.operators (
    name character varying NOT NULL,
    telephone character varying,
    celular character varying NOT NULL,
    address character varying NOT NULL,
    email character varying NOT NULL,
    dni character varying NOT NULL
);


ALTER TABLE public.operators OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16384)
-- Name: owners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.owners (
    dni character varying NOT NULL,
    name character varying NOT NULL,
    telephone character varying,
    celular character varying NOT NULL,
    address character varying NOT NULL,
    email character varying NOT NULL
);


ALTER TABLE public.owners OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16392)
-- Name: places; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.places (
    latitude bigint NOT NULL,
    longitude bigint NOT NULL,
    address character varying
);


ALTER TABLE public.places OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 16432)
-- Name: s_p; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.s_p (
    id_sensor integer NOT NULL,
    latitude integer NOT NULL,
    longitude integer NOT NULL
);


ALTER TABLE public.s_p OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16430)
-- Name: s_p_id_sensor_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.s_p_id_sensor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.s_p_id_sensor_seq OWNER TO postgres;

--
-- TOC entry 3076 (class 0 OID 0)
-- Dependencies: 206
-- Name: s_p_id_sensor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.s_p_id_sensor_seq OWNED BY public.s_p.id_sensor;


--
-- TOC entry 205 (class 1259 OID 16403)
-- Name: sensors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sensors (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    range_low integer NOT NULL,
    range_hight integer NOT NULL
);


ALTER TABLE public.sensors OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16401)
-- Name: sensor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sensor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sensor_id_seq OWNER TO postgres;

--
-- TOC entry 3077 (class 0 OID 0)
-- Dependencies: 204
-- Name: sensor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sensor_id_seq OWNED BY public.sensors.id;


--
-- TOC entry 2909 (class 2604 OID 16435)
-- Name: s_p id_sensor; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.s_p ALTER COLUMN id_sensor SET DEFAULT nextval('public.s_p_id_sensor_seq'::regclass);


--
-- TOC entry 2908 (class 2604 OID 16406)
-- Name: sensors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensors ALTER COLUMN id SET DEFAULT nextval('public.sensor_id_seq'::regclass);


--
-- TOC entry 3069 (class 0 OID 16649)
-- Dependencies: 211
-- Data for Name: alarms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3066 (class 0 OID 16453)
-- Dependencies: 208
-- Data for Name: measurements; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3068 (class 0 OID 16525)
-- Dependencies: 210
-- Data for Name: o_p; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3067 (class 0 OID 16495)
-- Dependencies: 209
-- Data for Name: operators; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3060 (class 0 OID 16384)
-- Dependencies: 202
-- Data for Name: owners; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.owners VALUES ('16603634', 'Juanito Valderrama', '222', '2222', 'Gran vía', 'aa@yahoo.com');


--
-- TOC entry 3061 (class 0 OID 16392)
-- Dependencies: 203
-- Data for Name: places; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.places VALUES (999, 999, 'Gran vía 11, 4 B');


--
-- TOC entry 3065 (class 0 OID 16432)
-- Dependencies: 207
-- Data for Name: s_p; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3063 (class 0 OID 16403)
-- Dependencies: 205
-- Data for Name: sensors; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3078 (class 0 OID 0)
-- Dependencies: 206
-- Name: s_p_id_sensor_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.s_p_id_sensor_seq', 1, false);


--
-- TOC entry 3079 (class 0 OID 0)
-- Dependencies: 204
-- Name: sensor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sensor_id_seq', 1, false);


--
-- TOC entry 2925 (class 2606 OID 16656)
-- Name: alarms alarm2_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alarms
    ADD CONSTRAINT alarm2_pkey PRIMARY KEY (date_time, latitude, longitude, id_sensor);


--
-- TOC entry 2919 (class 2606 OID 16457)
-- Name: measurements measurements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.measurements
    ADD CONSTRAINT measurements_pkey PRIMARY KEY (date_time, latitude, longitude);


--
-- TOC entry 2923 (class 2606 OID 16532)
-- Name: o_p o_p_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.o_p
    ADD CONSTRAINT o_p_pkey PRIMARY KEY (dni, latitude, longitude);


--
-- TOC entry 2921 (class 2606 OID 16504)
-- Name: operators operator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operators
    ADD CONSTRAINT operator_pkey PRIMARY KEY (dni);


--
-- TOC entry 2913 (class 2606 OID 16396)
-- Name: places pk_place; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT pk_place PRIMARY KEY (latitude, longitude);


--
-- TOC entry 2917 (class 2606 OID 16437)
-- Name: s_p s_p_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.s_p
    ADD CONSTRAINT s_p_pkey PRIMARY KEY (id_sensor, latitude, longitude);


--
-- TOC entry 2915 (class 2606 OID 16411)
-- Name: sensors sensor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensors
    ADD CONSTRAINT sensor_pkey PRIMARY KEY (id);


--
-- TOC entry 2911 (class 2606 OID 16391)
-- Name: owners usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owners
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (dni);


--
-- TOC entry 2931 (class 2606 OID 16657)
-- Name: alarms alarm_date_time_latitude_longitude_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alarms
    ADD CONSTRAINT alarm_date_time_latitude_longitude_fkey FOREIGN KEY (date_time, latitude, longitude) REFERENCES public.measurements(date_time, latitude, longitude);


--
-- TOC entry 2933 (class 2606 OID 16667)
-- Name: alarms alarm_dni_operator_acussated_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alarms
    ADD CONSTRAINT alarm_dni_operator_acussated_fkey FOREIGN KEY (dni_operator_acussated) REFERENCES public.operators(dni);


--
-- TOC entry 2932 (class 2606 OID 16662)
-- Name: alarms alarm_id_sensor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alarms
    ADD CONSTRAINT alarm_id_sensor_fkey FOREIGN KEY (id_sensor) REFERENCES public.sensors(id);


--
-- TOC entry 2928 (class 2606 OID 16672)
-- Name: measurements measurements_latitude_longitude_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.measurements
    ADD CONSTRAINT measurements_latitude_longitude_fkey FOREIGN KEY (latitude, longitude) REFERENCES public.places(latitude, longitude);


--
-- TOC entry 2929 (class 2606 OID 16533)
-- Name: o_p o_p_dni_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.o_p
    ADD CONSTRAINT o_p_dni_fkey FOREIGN KEY (dni) REFERENCES public.owners(dni);


--
-- TOC entry 2930 (class 2606 OID 16538)
-- Name: o_p o_p_latitude_longitude_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.o_p
    ADD CONSTRAINT o_p_latitude_longitude_fkey FOREIGN KEY (latitude, longitude) REFERENCES public.places(latitude, longitude);


--
-- TOC entry 2926 (class 2606 OID 16438)
-- Name: s_p s_p_id_sensor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.s_p
    ADD CONSTRAINT s_p_id_sensor_fkey FOREIGN KEY (id_sensor) REFERENCES public.sensors(id);


--
-- TOC entry 2927 (class 2606 OID 16443)
-- Name: s_p s_p_latitude_longitude_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.s_p
    ADD CONSTRAINT s_p_latitude_longitude_fkey FOREIGN KEY (latitude, longitude) REFERENCES public.places(latitude, longitude);


-- Completed on 2022-04-30 18:23:22 CEST

--
-- PostgreSQL database dump complete
--

