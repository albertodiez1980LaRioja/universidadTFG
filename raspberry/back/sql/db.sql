create table if not exists projects(
    id integer primary key generated by default as identity,
    name text not null check (name <> ''),
    priority integer not null,
    description text,
    deliverydate date not null
);

create table if not exists tasks(
    id integer primary key generated by default as identity,
    name text not null check (name <> ''),
    done boolean ,
    projectId integer references projects(id)
);

insert into projects(name,priority,description,deliverydate)
    values('Make a Web App',1,'Using JS','2019-05-12');

insert into tasks(name,done,projectId)    
    values('Download Angular',false,1);