<?PHP
    header('Content-Type: application/json');
    if (array_key_exists("status", $_GET)) {
        $playlist = array();
        exec("mpc playlist", $playlist);
        $status = array();
        exec("mpc", $status);
        $current = -1;
        if (count($status) > 0) {
            $probe = $status[0];
            for ( $i=0; $i < count($playlist) ; ++$i ) {
                if ($playlist[$i] == $probe) {
                    $current = $i;
                    break;
                }
            }
        }
        if ($current == -1) {
            exec("mpc stop");
        }
        echo '{ "playlist": ' . json_encode($playlist);
        echo ', "status": "ok"';
        echo ', "current": ' . $current . ' }';
    } else if (array_key_exists("play", $_GET)) {
        // TODO: error checking on the parameter
        $num = $_GET["play"];
        exec("mpc play " . ($num + 1));
        echo '{"status": "ok", "info": ' . $num . '}';
    } else if (array_key_exists("stop", $_GET)) {
        exec("mpc stop");
	echo '{"status": "ok"}';
    } else if (array_key_exists("up", $_GET)) {
        exec("mpc volume +5");
	echo '{"status": "ok"}';
    } else if (array_key_exists("down", $_GET)) {
        exec("mpc volume -5");
	echo '{"status": "ok"}';
    } else {
	echo '{"status": "error"}';
    }
?>
