# Smernice u pisanju koda

## Pokretanje i rad sa bash skriptama
Bash skripte su napravljene da olaksaju posao ovde u projektu. U slucaj u da ne mozete pokrenuti ```./protoc-run.sh``` ili ```./run.sh``` potrebno je pokrenuti ovo ```chmod +x <komanda>.sh```

Unutar ```./protoc-run.sh``` se pisu komande za kompajliranje protobuf _.proto_ fajlova sto mora da se dogodi pre docker-compose, unutar foldera proto se nalaze definicije DTO modela koji se koriste za medju komunikaciju.

Komanda ```./run.sh``` pokrece redom ```./protoc-run.sh```, nakon toga izvrsava kompajliranje gateway-a (golang koda), ovo se ovako izvrsava zbog dependency koje ima unutar go koda. Sto nije problem jer je go kompajliran i onda Dockefile samo prekopira executable pravac u container sto znaci da mu ne treba nista da skida za go (preporuka i za druge go servise koje cemo pisati da ovde dodajemo isto). Na kraju se samo poziva ```docker compose up --build```

## Endpoints

1. Za gRPC morate imati dodatni server koji moze da podrzava endpoint-e koji nisu REST

2. REST endpoint-i krecu as ```/api/...```

3. gRPC endpoint-i krecu sa ```/v1/...```, sto je samo standard

4. U slucaju da se menja gRPC endpoint potrebno je povecati verziju, primer: ```/v4/...``` -> ```/v5/...```

5. Po standardu endpoint-i ne bi trebali imati / na kraju, to uglavnom predstavlja skup endpoint-a koji imaju isti poziv pre /

6. Radi citnjivosti, biti eksplicitan u tome sta endpoint radi, primer: ```/api/nesto/{user_id}``` je los naziv jer ne govori sta endpoint radi nego samo gde Bolji naziv je ```/api/nesto/find/{user_id}```

7. Path parameteres preferabilno stavljati samo na kraju endpoint-a

8. Skroz neobavezno, ali radi standardizacije kroz projekat nazivi slicnih endpoint-a bi trebali biti:\
    8.1. kreiranje novog: ```/api/<servis>/new``` \
    8.2. brisanje: ```/api/<servis>/delete``` \
    8.3. trazenje: ```/api/<servis>/find/{id}``` \
    8.4. vracanje svih vrednosti: ```/api/<servis>/all``` \
    8.5. vracanje svih po parametru: ```/api/<servis>/find_all/{param}``` \
    8.6. izmena: ```/api/<servis>/edit/{id}``` \

9. Nazivi path parametara treba da predstavljaju konkretno sta traze da bi se iz samo pogleda na endpoint zna sta se trazi, primer:
    - ```/api/<servis>/find_all/{id}``` - ovo bi trebalo da se koristi samo u slucaju ako je _id_ konkretno ID objekta koji predstavlja servis
    - ```/api/<servis>/find_all/{user_id}``` - ovde se na pogled zna sta se trazi i da _user_id_ predstavlja ID user-a konkretno

10. U slucaju ako se radi sa objektima koji "pripadaju" servisu naziv endpoint-a endpoint bi trebao izgledati ovako ```/api/<servis>/<objekat>/...```, nazivi u endpoint-u se redjaju od najbitnijeg ka manje bitnom. Path parametar _id_ u slucaju ```/api/<servis>/<objekat>/.../{id}``` predstavlja ID objekta, ako postoji vise objekata u endpoint-u i dolazi do konfuzije staviti prefix objekta na koji se odnosi _\<objekat\>_id_ parametru

11. Ako endpoint zahteva trenutno ulogovanog user-a potrebno je u ```./backend/gateway/main.go``` u protectedRoutes ```{Path: "/[v1|api]/<servis>/<object>/<verb>", Role: auth.Role[Tourist|Admin|Guide]}: true, ```, zahteva naziv endpoint-a do prvog path parametra i zbog toga nije pozeljno imati path paramater pre dela endpoint-a koji specificira endpoint, odnosno protectedRoutes prihavata skup endpoint-a u slucaju da se endpoint zavrsava sa '/'

12. Kada je endpoint unutar protectedRoutes:
 - REST: unutar request header-a ce se nalaziti ID user-a pod nazivom "X-User-ID", takodje se tu nalaze i "X-User-Email" i "X-User-Role"
 - gRPC: potrebno je da _.proto_ objekat koji se nalazi unutar Response objekta sadrzi common.User

13. Portovi za gRPC:
 - Blog: 50051
 - Tours: 50052
 - Followers: 50053
