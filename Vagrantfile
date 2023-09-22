# -*- mode: ruby -*-
# # vi: set ft=ruby :

# vagrant config
$VM_BOX = 'ubuntu/focal64'
$VM_BOX = 'almalinux/9'
$VM_BOX = 'ailispaw/barge'

$DOCKER_DIR = "1_nginx_proxy"
$DOCKER_DIR = "2_apache-phpfpm"


$PRIVATE_IP_LIST = ['192.168.56.101', '192.168.56.102', '192.168.56.103']
$FORWARED_PORTS = []
$SHARED_FOLDERS = {
    './docker'=>'/vagrant/docker',
}


require 'fileutils'

#required_plugins = %w(vagrant-ignition vagrant-vbguest vagrant-disksize)
required_plugins = %w(vagrant-vbguest vagrant-disksize vagrant-winnfsd)

plugins_to_install = required_plugins.select { |plugin| not Vagrant.has_plugin? plugin }
if not plugins_to_install.empty?
    puts "Installing plugins: #{plugins_to_install.join(' ')}"

    if system "vagrant plugin install #{plugins_to_install.join(' ')}"
        exec "vagrant #{ARGV.join(' ')}"
    else
        abort "Installation of one or more plugins has failed. Aborting."
    end
end

Vagrant.configure("2") do |config|
    #config.ssh.insert_key = false
    config.vm.box = $VM_BOX

    config.vm.provider :virtualbox do |v|
        #v.check_guest_additions = false
        #v.functional_vboxsf     = false
        #v.memory = 1024
        #v.cpus = 1
        # Windowsの場合symbolic linkを有効化
        #v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/.","1"]
    end

    if Vagrant.has_plugin?("vagrant-vbguest") then
        config.vbguest.auto_update = false
    end

    # 共有フォルダ
    $SHARED_FOLDERS.each_with_index do |(host_folder, guest_folder), index|
        #config.vm.synced_folder host_folder.to_s, guest_folder.to_s, id: "vagrant-share%02d" % index, nfs: true, mount_options: ['nolock,vers=3,udp']
        #config.vm.synced_folder host_folder.to_s, guest_folder.to_s, nfs: true
        config.vm.synced_folder host_folder.to_s, guest_folder.to_s, type: "virtualbox"
    end

    # ポートの中継
    $FORWARED_PORTS.each do |guest, host|
        config.vm.network "forwarded_port", guest: guest, host: host, auto_correct: true
    end

    # IPアドレス
    $PRIVATE_IP_LIST.each do |ip, host|
        config.vm.network "private_network", ip: ip
        if host
            config.vm.hostname = host
        end
    end

    Docker.build(config)
end


class Docker
    # docker-composeインストール等
    def self.build(config)
        if $VM_BOX.include?("barge") || $VM_BOX.include?("alpine")
            # Bargeosの場合
            config.vm.provision :shell, privileged: true, inline: <<-SHELL
                /etc/init.d/docker restart 20.10.16

                mkdir -p /opt/bin
                wget -L https://github.com/docker/compose/releases/download/v2.17.2/docker-compose-`uname -s`-`uname -m` -O /opt/bin/docker-compose
                chmod +x /opt/bin/docker-compose
            SHELL
        end

        # docker-composeビルド
        config.vm.provision :shell, privileged: false, inline: <<-SHELL
            cd /vagrant/docker/#{$DOCKER_DIR} && docker-compose build
        SHELL

        # docker-compose起動
        config.vm.provision "shell", privileged: false, run: 'always', inline: <<-SHELL
            cd /vagrant/docker/#{$DOCKER_DIR} && docker-compose up -d 1>&2
        SHELL
    end
end