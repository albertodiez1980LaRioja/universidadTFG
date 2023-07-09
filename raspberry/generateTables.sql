-- public.actions definition

-- Drop table

-- DROP TABLE public.actions;

CREATE TABLE public.actions (
	date_time timestamp NOT NULL,
	binary_values int4 NOT NULL,
	CONSTRAINT outputs_pkey PRIMARY KEY (date_time)
);

-- public.place definition

-- Drop table

-- DROP TABLE public.place;

CREATE TABLE public.place (
	identifier text NOT NULL,
	pass text NOT NULL,
	url text NOT NULL,
	actualizationtime int4 NOT NULL,
	actualization_server_time int4 NULL,
	CONSTRAINT actions_pkey2 PRIMARY KEY (identifier)
);

-- public.sensors definition

-- Drop table

-- DROP TABLE public.sensors;

CREATE TABLE public.sensors (
	date_time timestamp NOT NULL,
	has_sended bool NOT NULL,
	binary_values int4 NOT NULL,
	has_persons int2 NOT NULL,
	has_sound int2 NOT NULL,
	has_gas int2 NOT NULL,
	has_oil int2 NOT NULL,
	has_rain int2 NOT NULL,
	temperature int2 NOT NULL,
	humidity int2 NOT NULL,
	to_send bool NOT NULL,
	CONSTRAINT sensors_pkey PRIMARY KEY (date_time)
);