ssh := "oracle"

run: fmt
  pnpm run dev

fmt:
  pnpm run format

build: fmt
  pnpm run build

preview: build
  pnpm run preview

build_docker: fmt
  docker build . -t paai_gs:latest -t paai_gs:$(jq -r .version < package.json)

send_container: build_docker
  docker save paai_gs:latest | zstd -T8 -5 | pv -W | ssh {{ssh}} 'docker load'
