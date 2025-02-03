
apt-get update && \
    apt-get install gpg -y 

mkdir -p /etc/apt/keyrings/
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor > /etc/apt/keyrings/grafana.gpg
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | tee /etc/apt/sources.list.d/grafana.list

apt-get update && \
    apt-get install loki=3.2.1 promtail -y 

systemd start loki
systemd enable loki
systemd start promtail
systemd enable promtail

# Disable metric aggregation in /etc/loki/config.yaml
