<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Collection;

class CleanExpiredSessions extends Command
{
    protected $signature = 'session:clean-expired';
    protected $description = 'Clean up expired session files';

    public function handle()
    {
        $sessionsPath = storage_path('framework/sessions');

        $expiredSessions = collect(File::glob($sessionsPath . '/*'))
            ->filter(function ($path) {
                return filemtime($path) + config('session.lifetime') * 60 < time();
            });

        foreach ($expiredSessions as $sessionFile) {
            File::delete($sessionFile);
            $this->info("Deleted expired session file: $sessionFile");
        }

        $this->info('Expired session files cleaned up.');
    }
}
