--
-- PostgreSQL database dump
--

-- Dumped from database version 16.5
-- Dumped by pg_dump version 16.5

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: equipe_membres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipe_membres (
    id_equipe integer NOT NULL,
    id_utilisateur integer NOT NULL
);


ALTER TABLE public.equipe_membres OWNER TO postgres;

--
-- Name: equipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipes (
    id_equipe integer NOT NULL,
    nom_equipe character varying(100) NOT NULL,
    description text,
    id_chef_de_projet integer
);


ALTER TABLE public.equipes OWNER TO postgres;

--
-- Name: equipes_id_equipe_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipes_id_equipe_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipes_id_equipe_seq OWNER TO postgres;

--
-- Name: equipes_id_equipe_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipes_id_equipe_seq OWNED BY public.equipes.id_equipe;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id_notification integer NOT NULL,
    message text NOT NULL,
    date_envoi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    type character varying(50),
    id_utilisateur integer,
    id_projet integer,
    lu boolean DEFAULT false
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_notification_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_notification_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_notification_seq OWNER TO postgres;

--
-- Name: notifications_id_notification_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_notification_seq OWNED BY public.notifications.id_notification;


--
-- Name: projets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projets (
    id_projet integer NOT NULL,
    nom character varying(100) NOT NULL,
    description text,
    date_debut date,
    date_fin date,
    statut character varying(50),
    id_client integer,
    id_chef_projet integer,
    image_path text,
    document_path text,
    raison_refus text,
    CONSTRAINT projets_statut_check CHECK (((statut)::text = ANY ((ARRAY['pending'::character varying, 'in progress'::character varying, 'completed'::character varying, 'accepted'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.projets OWNER TO postgres;

--
-- Name: projets_id_projet_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projets_id_projet_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projets_id_projet_seq OWNER TO postgres;

--
-- Name: projets_id_projet_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projets_id_projet_seq OWNED BY public.projets.id_projet;


--
-- Name: taches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.taches (
    id_tache integer NOT NULL,
    nom character varying(100) NOT NULL,
    description text,
    date_debut date,
    date_fin date,
    statut character varying(50) NOT NULL,
    id_projet integer,
    CONSTRAINT taches_statut_check CHECK (((statut)::text = ANY ((ARRAY['todo'::character varying, 'in_progress'::character varying, 'completed'::character varying])::text[])))
);


ALTER TABLE public.taches OWNER TO postgres;

--
-- Name: taches_id_tache_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.taches_id_tache_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.taches_id_tache_seq OWNER TO postgres;

--
-- Name: taches_id_tache_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.taches_id_tache_seq OWNED BY public.taches.id_tache;


--
-- Name: taches_membres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.taches_membres (
    id_tache integer NOT NULL,
    id_utilisateur integer NOT NULL
);


ALTER TABLE public.taches_membres OWNER TO postgres;

--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateurs (
    id_utilisateur integer NOT NULL,
    nom character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    mot_de_passe character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    CONSTRAINT utilisateurs_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'client'::character varying, 'chef_projet'::character varying, 'membre'::character varying])::text[])))
);


ALTER TABLE public.utilisateurs OWNER TO postgres;

--
-- Name: utilisateurs_id_utilisateur_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateurs_id_utilisateur_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateurs_id_utilisateur_seq OWNER TO postgres;

--
-- Name: utilisateurs_id_utilisateur_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateurs_id_utilisateur_seq OWNED BY public.utilisateurs.id_utilisateur;


--
-- Name: equipes id_equipe; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipes ALTER COLUMN id_equipe SET DEFAULT nextval('public.equipes_id_equipe_seq'::regclass);


--
-- Name: notifications id_notification; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id_notification SET DEFAULT nextval('public.notifications_id_notification_seq'::regclass);


--
-- Name: projets id_projet; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projets ALTER COLUMN id_projet SET DEFAULT nextval('public.projets_id_projet_seq'::regclass);


--
-- Name: taches id_tache; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taches ALTER COLUMN id_tache SET DEFAULT nextval('public.taches_id_tache_seq'::regclass);


--
-- Name: utilisateurs id_utilisateur; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs ALTER COLUMN id_utilisateur SET DEFAULT nextval('public.utilisateurs_id_utilisateur_seq'::regclass);


--
-- Data for Name: equipe_membres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipe_membres (id_equipe, id_utilisateur) FROM stdin;
3	46
3	47
3	25
\.


--
-- Data for Name: equipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipes (id_equipe, nom_equipe, description, id_chef_de_projet) FROM stdin;
1	Équipe A	Description de l'équipe A	33
2	Developpement web	Createur d'application web	29
3	IOT	Creation de maison connecte	44
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id_notification, message, date_envoi, type, id_utilisateur, id_projet, lu) FROM stdin;
17	Un nouveau projet nommé "Test08" a été commandé par le client ID 40.	2024-12-13 00:06:12.610326	Nouveau Projet	40	30	f
18	Un nouveau projet nommé "Test09" a été commandé par le client ID 44.	2024-12-13 01:21:52.101424	Nouveau Projet	44	31	t
6	Un nouveau projet nommé "Ny ANtsa" a été commandé par le client ID 42.	2024-12-01 05:13:53.691231	Nouveau Projet	42	12	t
4	Un nouveau projet nommé "OLOJOBY" a été commandé par le client ID 40.	2024-12-01 03:50:50.118285	Nouveau Projet	40	\N	t
1	Un nouveau projet nommé "loi" a été commandé par le client ID 40.	2024-11-28 03:36:42.681798	Nouveau Projet	40	\N	t
3	Un nouveau projet nommé "pomma" a été commandé par le client ID 40.	2024-11-28 22:12:20.617819	Nouveau Projet	40	\N	t
2	Un nouveau projet nommé "id" a été commandé par le client ID 40.	2024-11-28 05:37:33.422658	Nouveau Projet	40	\N	t
10	Un nouveau projet nommé "Test3" a été commandé par le client ID 42.	2024-12-01 06:22:55.341835	Nouveau Projet	42	23	t
9	Un nouveau projet nommé "Test2" a été commandé par le client ID 42.	2024-12-01 06:15:22.540882	Nouveau Projet	42	22	t
11	Un nouveau projet nommé "test4" a été commandé par le client ID 42.	2024-12-01 06:36:38.150602	Nouveau Projet	42	24	t
7	Un nouveau projet nommé "toi MOI" a été commandé par le client ID 40.	2024-12-01 06:09:26.374145	Nouveau Projet	40	\N	t
5	Un nouveau projet nommé "OLOJOBY" a été commandé par le client ID 42.	2024-12-01 05:10:38.383042	Nouveau Projet	42	11	t
12	Un nouveau projet nommé "test45" a été commandé par le client ID 40.	2024-12-02 04:56:36.673722	Nouveau Projet	40	25	t
8	Un nouveau projet nommé "Test RANDIA" a été commandé par le client ID 42.	2024-12-01 06:13:43.654111	Nouveau Projet	42	\N	t
13	Un nouveau projet nommé "TEST03" a été commandé par le client ID 42.	2024-12-03 06:15:13.598577	Nouveau Projet	42	26	t
14	Un nouveau projet nommé "TEST04" a été commandé par le client ID 42.	2024-12-03 06:16:02.918746	Nouveau Projet	42	27	f
15	Un nouveau projet nommé "TEST05" a été commandé par le client ID 42.	2024-12-03 06:19:32.052926	Nouveau Projet	42	28	f
16	Un nouveau projet nommé "TEST06" a été commandé par le client ID 42.	2024-12-03 06:23:10.566112	Nouveau Projet	42	29	t
\.


--
-- Data for Name: projets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projets (id_projet, nom, description, date_debut, date_fin, statut, id_client, id_chef_projet, image_path, document_path, raison_refus) FROM stdin;
11	OLOJOBY	lorem	2024-12-12	2024-12-27	accepted	42	\N	uploads\\1733019038035-just.jpg	\N	\N
23	Test3	test	2024-12-07	2025-01-02	accepted	42	\N	uploads\\1733023375100-bk.jpg	uploads\\1733023375101-Python_2023.pdf	\N
22	Test2	olo	2024-12-04	2025-01-05	rejected	42	\N	uploads\\1733022922393-just.jpg	uploads\\1733022922395-Python_2023.pdf	manque de ressource
25	test45	polio	2024-11-28	2024-12-26	accepted	40	\N	uploads\\1733104595962-bk.jpg	uploads\\1733104595963-Python_2023.pdf	\N
12	Ny ANtsa	bbxznckznc	2024-12-19	2024-12-01	accepted	42	\N	uploads\\1733019233549-bk.jpg	uploads\\1733019233549-Python_2023.pdf	manque de ressource
24	test4	lorem	2024-12-15	2025-01-02	accepted	42	\N	uploads\\1733024197998-bk.jpg	uploads\\1733024197999-Python_2023.pdf	\N
26	TEST03	LORIZÄ	2024-12-03	2025-02-09	accepted	42	\N	uploads\\1733195713050-bk.jpg	uploads\\1733195713051-Python_2023.pdf	\N
27	TEST04	FFF3 	2024-12-03	2025-01-03	accepted	42	\N	uploads\\1733195762766-just.jpg	\N	\N
28	TEST05	okhugyu	2024-12-03	2025-01-05	accepted	42	\N	uploads\\1733195971835-just.jpg	uploads\\1733195971836-Python_2023.pdf	\N
29	TEST06	ppko	2024-12-03	2025-01-05	accepted	42	29	uploads\\1733196190406-bk.jpg	uploads\\1733196190406-Python_2023.pdf	\N
31	Test09	dzdzdz	2024-12-29	2025-01-05	in progress	44	44	\N	\N	\N
30	Test08	lop	2024-11-28	2025-01-05	in progress	40	44	uploads\\1734037572067-just.jpg	uploads\\1734037572148-Python_2023.pdf	\N
\.


--
-- Data for Name: taches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.taches (id_tache, nom, description, date_debut, date_fin, statut, id_projet) FROM stdin;
22	Moi	grge	2024-12-02	2025-01-05	todo	30
16	Moi	^bttgrbt	2024-12-12	2025-01-05	in_progress	30
21	yo	fef	2024-11-26	2025-01-04	completed	31
23	Manda Ange Daniel RAJAONARIHERY	vfr	2024-12-04	2025-01-05	todo	31
\.


--
-- Data for Name: taches_membres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.taches_membres (id_tache, id_utilisateur) FROM stdin;
16	46
21	46
22	46
23	46
23	25
23	47
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs (id_utilisateur, nom, email, mot_de_passe, role) FROM stdin;
33	Manda Ange Daniel RAJAONARIHER	mandarajaonarihery@gmail2.com	pm	chef_projet
25	clade2 	claude.@example.com	iolc	membre
34	Mandabtn	rajaonariherymanddvdvsdvadaniel@gmail.com	qxsqcsqvqv	chef_projet
35	Go	go@gmail.com	go	admin
36	client	cla@gmail.com	cla	client
37	John Doe	john.doe@example.com	password123	client
38	John Doe	test@example.com	$2b$10$pN91C5ZAxDu4PJj8y1ACBOnPww.1KbTThs6TFShZPintb7VdSEWMG	client
39	Olivier RAKOTOVAO	ol@gmail.com	$2b$10$8s49HVn7gkub63rd5csbAO3o/YcYnoJuC5UClJ7AczOFdU1NEFc/a	client
40	hadji	hadji@gmail.com	$2b$10$cxMlW8s24355tLuStdw2tumT5BBicQrANg.bWxqKTL7c7O5OA/RYe	client
41	m	mi@gmail.com	o123	admin
42	yo	y@gmail.com	$2b$10$f5HO.CJcbQn6Jkb.rvRcI.UdRrdhQPX3N7VxzlirOGmM3BLQueDcy	admin
43	Manda	mo@gmail.com	$2b$10$/3M1fEx6.yosJn4xWg1UzOOJwcER2XKq8ATGYwgj9GGCFcm2inoh6	client
44	Moi	mp@gmail.com	$2b$10$czTjbzK9LLE8sZpvSFzcO.SIWjkfJOhdZKmI9WIp9MSCLwRSXqZtq	chef_projet
45	rajaonarihery	rajaonarihery@gmail.com	$2b$10$JKtRZMq9LvBCCn6IJ/ZpOe/IW/W6Mplrof7yb6NCSK2KG0CzO9CXC	client
46	ILO	i@gmail.com	$2b$10$Ke10Ri6.49pgRk4uHF.5he5KCQBZDzR5TyBSzlSunmxWj0zQw.e9a	membre
47	toi MOI	t@gmail.com	$2b$10$gCnA.GFxFhHNmEnXK0h.6uly8IjuWcM.ZDb3VGkOhdwYrKWISKV5i	membre
48	tuti	tu@gmail.com	$2b$10$/KrWEusucKIQmP6IxDYWpuWj.RyGW4uHh1XmrzZwWusvXgUbW/s7G	membre
30	Manda Ange Daniel RAJAONARIHERY	mandarajaonarihery@gmail.com	m123	chef_projet
29	pomz 	claude.@mopc.com	ioz	chef_projet
\.


--
-- Name: equipes_id_equipe_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipes_id_equipe_seq', 3, true);


--
-- Name: notifications_id_notification_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_notification_seq', 18, true);


--
-- Name: projets_id_projet_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projets_id_projet_seq', 31, true);


--
-- Name: taches_id_tache_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.taches_id_tache_seq', 23, true);


--
-- Name: utilisateurs_id_utilisateur_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateurs_id_utilisateur_seq', 48, true);


--
-- Name: equipe_membres equipe_membres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipe_membres
    ADD CONSTRAINT equipe_membres_pkey PRIMARY KEY (id_equipe, id_utilisateur);


--
-- Name: equipes equipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipes
    ADD CONSTRAINT equipes_pkey PRIMARY KEY (id_equipe);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id_notification);


--
-- Name: projets projets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projets
    ADD CONSTRAINT projets_pkey PRIMARY KEY (id_projet);


--
-- Name: taches_membres taches_membres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taches_membres
    ADD CONSTRAINT taches_membres_pkey PRIMARY KEY (id_tache, id_utilisateur);


--
-- Name: taches taches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taches
    ADD CONSTRAINT taches_pkey PRIMARY KEY (id_tache);


--
-- Name: utilisateurs utilisateurs_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_email_key UNIQUE (email);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id_utilisateur);


--
-- Name: equipe_membres equipe_membres_id_equipe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipe_membres
    ADD CONSTRAINT equipe_membres_id_equipe_fkey FOREIGN KEY (id_equipe) REFERENCES public.equipes(id_equipe) ON DELETE CASCADE;


--
-- Name: equipe_membres equipe_membres_id_utilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipe_membres
    ADD CONSTRAINT equipe_membres_id_utilisateur_fkey FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateurs(id_utilisateur) ON DELETE CASCADE;


--
-- Name: equipes equipes_id_chef_de_projet_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipes
    ADD CONSTRAINT equipes_id_chef_de_projet_fkey FOREIGN KEY (id_chef_de_projet) REFERENCES public.utilisateurs(id_utilisateur) ON DELETE SET NULL;


--
-- Name: taches_membres fk_taches; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taches_membres
    ADD CONSTRAINT fk_taches FOREIGN KEY (id_tache) REFERENCES public.taches(id_tache) ON DELETE CASCADE;


--
-- Name: notifications notifications_id_projet_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_id_projet_fkey FOREIGN KEY (id_projet) REFERENCES public.projets(id_projet) ON DELETE SET NULL;


--
-- Name: notifications notifications_id_utilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_id_utilisateur_fkey FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateurs(id_utilisateur) ON DELETE CASCADE;


--
-- Name: projets projets_id_chef_projet_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projets
    ADD CONSTRAINT projets_id_chef_projet_fkey FOREIGN KEY (id_chef_projet) REFERENCES public.utilisateurs(id_utilisateur) ON DELETE SET NULL;


--
-- Name: projets projets_id_client_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projets
    ADD CONSTRAINT projets_id_client_fkey FOREIGN KEY (id_client) REFERENCES public.utilisateurs(id_utilisateur) ON DELETE CASCADE;


--
-- Name: taches taches_id_projet_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taches
    ADD CONSTRAINT taches_id_projet_fkey FOREIGN KEY (id_projet) REFERENCES public.projets(id_projet) ON DELETE CASCADE;


--
-- Name: taches_membres taches_membres_id_tache_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taches_membres
    ADD CONSTRAINT taches_membres_id_tache_fkey FOREIGN KEY (id_tache) REFERENCES public.taches(id_tache) ON DELETE CASCADE;


--
-- Name: taches_membres taches_membres_id_utilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taches_membres
    ADD CONSTRAINT taches_membres_id_utilisateur_fkey FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateurs(id_utilisateur) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

