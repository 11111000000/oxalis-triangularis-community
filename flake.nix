{
  description = "Oxalis Triangularis Community dev shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            just
            git
            nodejs_22
            python3
            nixpkgs-fmt
            direnv
          ];

          shellHook = ''
            export PROJECT_ROOT="$PWD"
            echo "Oxalis Triangularis Community dev shell ready"
            echo "Run: just help"
          '';
        };
      });
}
