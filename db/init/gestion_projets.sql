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
    lu boolean DEFAULT false,
    priorite integer DEFAULT 1,
    date_lecture timestamp without time zone,
    destinataire character varying(50),
    id_tache integer,
    CONSTRAINT destinataire_check CHECK (((destinataire)::text = ANY ((ARRAY['Client'::character varying, 'Admin'::character varying, 'Chef'::character varying, 'Membre'::character varying])::text[]))),
    CONSTRAINT type_check CHECK (((type)::text = ANY (ARRAY[('Commande'::character varying)::text, ('Attribution'::character varying)::text, ('Tache'::character varying)::text, ('Tache_termine'::character varying)::text, ('Fin_de_projet'::character varying)::text, ('Deadline_proche'::character varying)::text, ('Accepte'::character varying)::text, ('Refuse'::character varying)::text])))
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
    CONSTRAINT projets_statut_check CHECK (((statut)::text = ANY ((ARRAY['pending'::character varying, 'in progress'::character varying, 'completed'::character varying, 'accepted'::character varying, 'in review'::character varying, 'validated'::character varying, 'rejected'::character varying])::text[])))
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
\.


--
-- Data for Name: equipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipes (id_equipe, nom_equipe, description, id_chef_de_projet) FROM stdin;
2	Developpement web	Createur d'application web	29
3	IOT	Creation de maison connecte	44
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id_notification, message, date_envoi, type, id_utilisateur, id_projet, lu, priorite, date_lecture, destinataire, id_tache) FROM stdin;
43	Un nouveau projet nommé "teste 55" a été commandé par le client ID 49.	2025-02-01 02:27:36.93498	Commande	42	36	f	1	\N	Admin	\N
44	Un nouveau projet nommé "teste 56" a été commandé par le client ID 49.	2025-02-01 02:31:04.244134	Commande	42	37	f	1	\N	Admin	\N
45	Votre projet "teste 56" a été accepté et un chef de projet a été assigné.	2025-02-01 02:32:18.631462	Accepte	49	37	f	1	\N	Client	\N
47	Votre projet "teste 56" a été accepté et un chef de projet a été assigné.	2025-02-01 02:32:19.913359	Accepte	49	37	f	1	\N	Client	\N
49	Votre projet "teste 56" a été accepté et un chef de projet a été assigné.	2025-02-01 02:32:21.024466	Accepte	49	37	f	1	\N	Client	\N
19	Le statut de la tâche "Moi" dans le projet "Test08" a été mis à jour à "completed".	2025-01-04 15:08:35.212193	Tache	44	30	f	1	\N	Chef	\N
51	Votre projet "teste 56" a été accepté et un chef de projet a été assigné.	2025-02-01 02:32:21.558776	Accepte	49	37	f	1	\N	Client	\N
53	Votre projet "teste 56" a été accepté et un chef de projet a été assigné.	2025-02-01 02:32:22.059083	Accepte	49	37	f	1	\N	Client	\N
20	Le statut de la tâche "Manda Ange Daniel RAJAONARIHERY" dans le projet "Test09" a été mis à jour à "in_progress".	2025-01-04 15:14:34.719918	Tache	44	31	f	1	\N	Chef	\N
21	Une nouvelle tâche "scs" vous a été assignée pour le projet ID 31.	2025-01-06 02:27:11.571044	Attribution	47	31	f	1	\N	Membre	27
23	Une nouvelle tâche "Moi" vous a été assignée pour le projet ID 30.	2025-01-06 02:34:33.227615	Attribution	46	30	f	1	\N	Membre	29
24	Le statut de la tâche "Manda Ange Daniel RAJAONARIHERY" dans le projet "Test09" a été mis à jour à "completed".	2025-01-06 13:06:15.950595	Tache	44	31	f	1	\N	Chef	\N
25	Le statut de la tâche "toi MOI" dans le projet "Test08" a été mis à jour à "in_progress".	2025-01-06 13:06:17.589455	Tache	44	30	f	1	\N	Chef	\N
26	Le statut de la tâche "toi MOI" dans le projet "Test08" a été mis à jour à "completed".	2025-01-06 13:06:19.087787	Tache	44	30	f	1	\N	Chef	\N
27	Le statut de la tâche "Moi" dans le projet "Test08" a été mis à jour à "in_progress".	2025-01-06 13:06:20.358798	Tache	44	30	f	1	\N	Chef	\N
28	Le statut de la tâche "Moi" dans le projet "Test08" a été mis à jour à "completed".	2025-01-06 13:06:21.571494	Tache	44	30	f	1	\N	Chef	\N
55	Votre projet "teste 56" a été accepté et un chef de projet a été assigné.	2025-02-01 02:32:22.590914	Accepte	49	37	f	1	\N	Client	\N
57	Votre projet "teste 56" a été accepté et un chef de projet a été assigné.	2025-02-01 02:32:23.35053	Accepte	49	37	f	1	\N	Client	\N
59	Votre projet "teste 56" a été accepté et un chef de projet a été assigné.	2025-02-01 02:32:23.88889	Accepte	49	37	f	1	\N	Client	\N
61	Votre projet "teste 56" a été accepté et un chef de projet a été assigné.	2025-02-01 02:32:24.306766	Accepte	49	37	f	1	\N	Client	\N
29	Le projet avec l'ID 30 a été terminé.	2025-01-06 13:07:07.209002	Fin_de_projet	42	30	t	1	2025-01-27 20:24:35.352	Admin	\N
63	Votre projet "teste 56" a été accepté et un chef de projet a été assigné.	2025-02-01 02:32:24.998014	Accepte	49	37	f	1	\N	Client	\N
30	Le projet avec l'ID 30 a été terminé.	2025-01-06 14:07:10.784065	Fin_de_projet	42	30	t	1	2025-01-27 20:47:33.05	Admin	\N
31	Un nouveau projet nommé "test 22" a été commandé par le client ID 49.	2025-01-31 18:01:54.317344	Commande	42	33	f	1	\N	Admin	\N
32	Un nouveau projet nommé "teste 23" a été commandé par le client ID 46.	2025-01-31 18:05:59.415724	Commande	42	34	f	1	\N	Admin	\N
33	Une nouvelle tâche "Dodo" vous a été assignée pour le projet ID 34.	2025-01-31 18:07:57.698209	Attribution	46	34	f	1	\N	Membre	30
34	Le statut de la tâche "Dodo" dans le projet "teste 23" a été mis à jour à "in_progress".	2025-01-31 18:09:04.89954	Tache	44	34	f	1	\N	Chef	\N
71	Une nouvelle tâche "yo" vous a été assignée pour le projet ID 31.	2025-02-01 09:21:42.433205	Attribution	46	31	f	1	\N	Membre	32
35	Le statut de la tâche "Dodo" dans le projet "teste 23" a été mis à jour à "completed".	2025-01-31 18:09:08.742978	Tache	44	34	f	1	\N	Chef	\N
36	Le projet avec l'ID 34 a été terminé.	2025-01-31 18:19:18.907669	Fin_de_projet	42	34	f	1	\N	Admin	\N
37	Le projet avec l'ID 34 a été terminé.	2025-01-31 18:58:06.779755	Fin_de_projet	42	34	f	1	\N	Admin	\N
38	Un nouveau projet nommé "teste22" a été commandé par le client ID 49.	2025-01-31 20:10:50.335662	Commande	42	35	f	1	\N	Admin	\N
39	Une nouvelle tâche "tahce" vous a été assignée pour le projet ID 35.	2025-01-31 20:12:27.7951	Attribution	46	35	f	1	\N	Membre	31
72	Le statut de la tâche "yo" dans le projet "Test09" a été mis à jour à "in_progress".	2025-02-01 10:23:20.535222	Tache	44	31	f	1	\N	Chef	\N
73	Le statut de la tâche "yo" dans le projet "Test09" a été mis à jour à "completed".	2025-02-01 10:46:14.410688	Tache	44	31	f	1	\N	Chef	\N
74	Une nouvelle tâche "pomme ANALYSE" vous a été assignée pour le projet ID 37.	2025-02-01 10:48:19.815925	Attribution	46	37	f	1	\N	Membre	33
75	Une nouvelle tâche "iouigu" vous a été assignée pour le projet ID 31.	2025-02-01 11:09:11.583831	Attribution	46	31	f	1	\N	Membre	34
40	Le statut de la tâche "tahce" dans le projet "teste22" a été mis à jour à "in_progress".	2025-01-31 20:13:10.599368	Tache	44	35	f	1	\N	Chef	\N
41	Le statut de la tâche "tahce" dans le projet "teste22" a été mis à jour à "completed".	2025-01-31 20:13:15.993654	Tache	44	35	f	1	\N	Chef	\N
42	Le projet avec l'ID 35 a été terminé.	2025-01-31 20:13:50.778319	Fin_de_projet	42	35	f	1	\N	Admin	\N
76	Un nouveau projet nommé "Système de surveillance de serre connectée" a été commandé par le client ID 49.	2025-02-01 11:43:36.075362	Commande	42	38	f	1	\N	Admin	\N
81	Une nouvelle tâche "Installation des capteurs" vous a été assignée pour le projet ID 38.	2025-02-01 11:48:03.75265	Attribution	46	38	f	1	\N	Membre	35
77	Votre projet "Système de surveillance de serre connectée" a été accepté et un chef de projet a été assigné.	2025-02-01 11:44:23.59696	Accepte	49	38	t	1	2025-02-13 20:29:34.748	Client	\N
69	Votre projet "teste 56" a été accepté et un chef de projet a été assigné.	2025-02-01 02:32:26.602376	Accepte	49	37	t	1	2025-02-13 20:29:38.84	Client	\N
67	Votre projet "teste 56" a été accepté et un chef de projet a été assigné.	2025-02-01 02:32:26.02551	Accepte	49	37	t	1	2025-02-13 20:29:41.274	Client	\N
65	Votre projet "teste 56" a été accepté et un chef de projet a été assigné.	2025-02-01 02:32:25.492288	Accepte	49	37	t	1	2025-02-13 20:29:44.186	Client	\N
82	Le statut de la tâche "Installation des capteurs" dans le projet "Système de surveillance de serre connectée" a été mis à jour à "in_progress".	2025-02-01 11:48:44.976201	Tache	44	38	f	1	\N	Chef	\N
83	Le statut de la tâche "Installation des capteurs" dans le projet "Système de surveillance de serre connectée" a été mis à jour à "completed".	2025-02-01 11:48:54.214015	Tache	44	38	f	1	\N	Chef	\N
84	Le projet avec l'ID 38 a été terminé.	2025-02-01 11:49:28.741012	Fin_de_projet	42	38	f	1	\N	Admin	\N
86	Un nouveau projet nommé "Système de surveillance de serre" a été commandé par le client ID 49.	2025-02-06 18:06:33.749767	Commande	42	39	f	1	\N	Admin	\N
88	Une nouvelle tâche "Configuration de la passerelle réseau" vous a été assignée pour le projet ID 39.	2025-02-06 18:09:06.124956	Attribution	46	39	f	1	\N	Membre	36
89	Le statut de la tâche "Configuration de la passerelle réseau" dans le projet "Système de surveillance de serre" a été mis à jour à "in_progress".	2025-02-06 18:10:16.352069	Tache	44	39	f	1	\N	Chef	\N
79	Votre projet "Système de surveillance de serre connectée" a été accepté et un chef de projet a été assigné.	2025-02-01 11:44:28.636562	Accepte	49	38	t	1	2025-02-13 20:29:27.655	Client	\N
85	Votre projet "Système de surveillance de serre connectée" a été complété avec succès.	2025-02-01 11:49:55.395412	Refuse	49	38	t	1	2025-02-13 20:29:30.734	Client	\N
87	Votre projet "Système de surveillance de serre" a été accepté et un chef de projet a été assigné.	2025-02-06 18:07:18.179235	Accepte	49	39	t	1	2025-02-13 20:29:32.068	Client	\N
90	Le statut de la tâche "Configuration de la passerelle réseau" dans le projet "Système de surveillance de serre" a été mis à jour à "completed".	2025-02-13 23:31:10.988992	Tache	44	39	f	1	\N	Chef	\N
91	Le projet avec l'ID 39 a été terminé.	2025-02-13 23:31:51.027985	Fin_de_projet	42	39	f	1	\N	Admin	\N
92	Votre projet "Système de surveillance de serre" a été complété avec succès.	2025-02-13 23:32:09.207026	Refuse	49	39	f	1	\N	Client	\N
93	Un nouveau projet nommé "Système de surveillance de serre connectée 0005" a été commandé par le client ID 49.	2025-02-17 21:46:30.229563	Commande	42	40	f	1	\N	Admin	\N
94	Votre projet "Système de surveillance de serre connectée 0005" a été accepté et un chef de projet a été assigné.	2025-02-17 21:47:46.937295	Accepte	49	40	f	1	\N	Client	\N
95	Une nouvelle tâche "Tests de communication" vous a été assignée pour le projet ID 40.	2025-02-17 21:49:53.502156	Attribution	46	40	f	1	\N	Membre	37
96	Le statut de la tâche "Tests de communication" dans le projet "Système de surveillance de serre connectée 0005" a été mis à jour à "in_progress".	2025-02-17 21:50:47.45515	Tache	44	40	f	1	\N	Chef	\N
97	Le statut de la tâche "Tests de communication" dans le projet "Système de surveillance de serre connectée 0005" a été mis à jour à "completed".	2025-02-17 21:50:54.753145	Tache	44	40	f	1	\N	Chef	\N
98	Le projet avec l'ID 40 a été terminé.	2025-02-17 21:51:46.513851	Fin_de_projet	42	40	f	1	\N	Admin	\N
99	Votre projet "Système de surveillance de serre connectée 0005" a été complété avec succès.	2025-02-17 21:52:15.902659	Refuse	49	40	f	1	\N	Client	\N
\.


--
-- Data for Name: projets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projets (id_projet, nom, description, date_debut, date_fin, statut, id_client, id_chef_projet, image_path, document_path, raison_refus) FROM stdin;
38	Système de surveillance de serre connectée	Un projet IoT visant à surveiller et automatiser les conditions climatiques (température, humidité, lumière) dans une serre agricole. Le système utilise des capteurs connectés pour collecter des données en temps réel et ajuste automatiquement l'arrosage et la ventilation.\r\n	2025-02-01	2025-02-22	completed	49	44	uploads\\1738399415542-Exemples-fiches-projet-2.jpg	uploads\\1738399415606-Liris-2799.pdf	\N
40	Système de surveillance de serre connectée 0005	Un projet IoT visant à surveiller et automatiser les conditions climatiques (température, humidité, lumière) dans une serre agricole. Le système utilise des capteurs connectés pour collecter des données en temps réel et ajuste automatiquement l'arrosage et la ventilation.\r\n	2025-02-17	2025-02-28	completed	49	44	uploads\\1739817989372-Capture dâÃ©cran 2025-02-16 225122.png	uploads\\1739817989491-Liris-2799.pdf	\N
26	TEST03	LORIZÄ	2024-12-03	2025-02-09	accepted	42	\N	uploads\\1733195713050-bk.jpg	uploads\\1733195713051-Python_2023.pdf	\N
27	TEST04	FFF3 	2024-12-03	2025-01-03	accepted	42	\N	uploads\\1733195762766-just.jpg	\N	\N
28	TEST05	okhugyu	2024-12-03	2025-01-05	accepted	42	\N	uploads\\1733195971835-just.jpg	uploads\\1733195971836-Python_2023.pdf	\N
34	teste 23	lorem	2025-01-31	2025-02-07	completed	46	44	uploads\\1738335959184-_30522194-7e39-4535-ac6e-3b1427a9567a.jpeg	uploads\\1738335959248-CANEVAS-L2-ENI-2022-2023.pdf	\N
29	TEST06	ppko	2024-12-03	2025-01-05	accepted	42	29	uploads\\1733196190406-bk.jpg	uploads\\1733196190406-Python_2023.pdf	\N
39	Système de surveillance de serre	Un projet IoT visant à surveiller et automatiser les conditions climatiques (température, humidité, lumière) dans une serre agricole. Le système utilise des capteurs connectés pour collecter des données en temps réel et ajuste automatiquement l'arrosage et la ventilation.\r\n	2025-02-06	2025-02-28	completed	49	44	uploads\\1738854392887-Gemini_Generated_Image_3bo4r03bo4r03bo4.jpeg	uploads\\1738854392958-Liris-2799.pdf	\N
31	Test09	dzdzdz	2024-12-29	2025-01-05	in progress	44	44	\N	\N	\N
30	Test08	lop	2024-11-28	2025-01-05	completed	40	44	uploads\\1734037572067-just.jpg	uploads\\1734037572148-Python_2023.pdf	\N
32	teste10	lorem	2025-01-08	2025-02-09	pending	40	\N	uploads\\1736301222296-6634224359896cd029c3cbd4_Screenshot_8.png	uploads\\1736301222365-Electronique Analogique 2.pdf	\N
33	test 22	lorem	2025-01-31	2025-02-09	accepted	49	29	uploads\\1738335713992-e.png	uploads\\1738335714029-03-Bakery.pdf	\N
35	teste22	lorem	2025-01-31	2025-02-14	completed	49	44	uploads\\1738343449494-462549163_537002222266577_1500151755687930701_n.jpg	uploads\\1738343449540-Support-malware.pdf	\N
36	teste 55	lorem	2025-01-31	2025-02-15	accepted	49	44	uploads\\1738366055974-motherboard-computer-motherboard-internationale-computermesse-cebit-C10KKN.jpg	uploads\\1738366056028-0388-csharp-dot-net-poo.pdf	\N
37	teste 56	pol	2025-01-31	2025-02-12	in progress	49	44	uploads\\1738366264121-smmec.png	uploads\\1738366264121-level1_2.pdf	\N
\.


--
-- Data for Name: taches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.taches (id_tache, nom, description, date_debut, date_fin, statut, id_projet) FROM stdin;
16	Moi	^bttgrbt	2024-12-12	2025-01-05	completed	30
27	scs	ssc	2025-01-10	2025-02-09	todo	31
23	Manda Ange Daniel RAJAONARIHERY	vfr	2024-12-04	2025-01-05	completed	31
25	toi MOI	olejf	2025-01-01	2025-02-09	completed	30
29	Moi	qxq	2025-01-02	2025-02-09	completed	30
30	Dodo	lorem	2025-01-31	2025-02-12	completed	34
31	tahce	lorem	2025-01-31	2025-02-18	completed	35
32	yo	oio	2025-02-22	2025-02-22	completed	31
33	pomme ANALYSE	lorem	2025-02-01	2025-02-08	todo	37
34	iouigu	jyyyyy	2025-02-02	2025-02-08	todo	31
35	Installation des capteurs	 Montage des capteurs de température, humidité et luminosité	2025-02-01	2025-02-07	completed	38
36	Configuration de la passerelle réseau	Paramétrage de la passerelle pour la communication des données 	2025-02-06	2025-02-13	completed	39
37	Tests de communication	Vérification de la remontée des données IoT	2025-02-17	2025-02-21	completed	40
\.


--
-- Data for Name: taches_membres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.taches_membres (id_tache, id_utilisateur) FROM stdin;
16	46
23	46
23	47
25	46
27	47
29	46
30	46
31	46
32	46
33	46
34	46
35	46
36	46
37	46
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs (id_utilisateur, nom, email, mot_de_passe, role) FROM stdin;
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
29	pomz 	claude.@mopc.com	ioz	chef_projet
49	Manda Ange Daniel RAJAONARIHERY	mandarajaonarihery@gmail.com	$2a$10$kYL7otwmBZH/qQiJ9HPkg.d4hB9JsOVx9Odo8LZSmjUzibanNWC4O	client
\.


--
-- Name: equipes_id_equipe_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipes_id_equipe_seq', 4, true);


--
-- Name: notifications_id_notification_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_notification_seq', 99, true);


--
-- Name: projets_id_projet_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projets_id_projet_seq', 40, true);


--
-- Name: taches_id_tache_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.taches_id_tache_seq', 37, true);


--
-- Name: utilisateurs_id_utilisateur_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateurs_id_utilisateur_seq', 49, true);


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
    ADD CONSTRAINT notifications_id_projet_fkey FOREIGN KEY (id_projet) REFERENCES public.projets(id_projet) ON DELETE CASCADE;


--
-- Name: notifications notifications_id_tache_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_id_tache_fkey FOREIGN KEY (id_tache) REFERENCES public.taches(id_tache) ON DELETE CASCADE;


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

