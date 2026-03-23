#[cfg(not(debug_assertions))]
use std::process::Command;
#[cfg(not(debug_assertions))]
use tauri::Manager;

/// Handle for the spawned Next.js server process so we can kill it on exit.
#[cfg(not(debug_assertions))]
struct NextServer(std::sync::Arc<std::sync::Mutex<Option<std::process::Child>>>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // In production builds (non-debug), start the bundled Next.js
            // standalone server automatically.  In development, the dev server
            // is started by beforeDevCommand so nothing extra is needed.
            #[cfg(not(debug_assertions))]
            {
                let resource_dir = app
                    .path()
                    .resource_dir()
                    .expect("could not resolve resource dir");

                let server_js = resource_dir
                    .join(".next")
                    .join("standalone")
                    .join("server.js");

                let node_bin = which_node();

                let child = Command::new(&node_bin)
                    .arg(&server_js)
                    .env("PORT", "3000")
                    .env("HOSTNAME", "127.0.0.1")
                    .env("NODE_ENV", "production")
                    .spawn()
                    .expect("failed to start Next.js server");

                app.manage(NextServer(std::sync::Arc::new(std::sync::Mutex::new(Some(child)))));

                // Poll until the server responds (or give up after 30 s).
                wait_for_server("http://127.0.0.1:3000", 30);
            }

            #[cfg(debug_assertions)]
            let _ = app;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}

/// Block until `url` returns any HTTP response, or until `timeout_secs` elapses.
#[cfg(not(debug_assertions))]
fn wait_for_server(url: &str, timeout_secs: u64) {
    use std::time::{Duration, Instant};
    let deadline = Instant::now() + Duration::from_secs(timeout_secs);
    while Instant::now() < deadline {
        if std::net::TcpStream::connect("127.0.0.1:3000").is_ok() {
            return;
        }
        std::thread::sleep(Duration::from_millis(200));
    }
}

/// Returns the path to a `node` executable, preferring common install locations.
#[cfg(not(debug_assertions))]
fn which_node() -> std::path::PathBuf {
    // On Windows, `node.exe` is usually on PATH.
    #[cfg(target_os = "windows")]
    {
        if let Ok(output) = Command::new("where").arg("node").output() {
            let s = String::from_utf8_lossy(&output.stdout);
            let first = s.lines().next().unwrap_or("").trim();
            if !first.is_empty() {
                return std::path::PathBuf::from(first);
            }
        }
        return std::path::PathBuf::from("node.exe");
    }

    // On macOS / Linux use `which`.
    #[cfg(not(target_os = "windows"))]
    {
        if let Ok(output) = Command::new("which").arg("node").output() {
            let s = String::from_utf8_lossy(&output.stdout);
            let trimmed = s.trim();
            if !trimmed.is_empty() {
                return std::path::PathBuf::from(trimmed);
            }
        }
        for path in &[
            "/usr/local/bin/node",
            "/usr/bin/node",
            "/opt/homebrew/bin/node",
            "/home/linuxbrew/.linuxbrew/bin/node",
        ] {
            if std::path::Path::new(path).exists() {
                return std::path::PathBuf::from(path);
            }
        }
        std::path::PathBuf::from("node")
    }
}
